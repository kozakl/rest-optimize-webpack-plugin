const ConcatSource = require('webpack-core/lib/ConcatSource'),
      StringUtil   = require('./utils/StringUtil');
/**
 * @author kozakluke@gmail.com
 */
class Main
{
    apply(compiler)
    {
        compiler.plugin('compilation', (compilation)=> {
            this.compilation = compilation;
            this.compilation.plugin('optimize-chunk-assets', (chunks, done)=> {
                chunks.forEach(this.processChunk.bind(this));
                done();
            });
        });
    }
    
    processChunk(chunk)
    {
        chunk.files.forEach(this.processFile.bind(this));
    }
    
    processFile(file)
    {
        this.simpleArgs(file);
        this.complexArgs(file);
    }
    
    simpleArgs(file)
    {
        let source = this.compilation.assets[file].source(),
            middle = source.indexOf('0; _i < arguments.length;');
        while (middle !==-1)
        {
            const term1 = StringUtil.backSearch(source, '{', middle),
                  term2 = StringUtil.backSearch(source, '}', middle),
                  begin = StringUtil.backSearch(source, '[', middle),
                  end   = source.indexOf('}', middle);
            if (term1 < begin && term2 < begin)
                source = StringUtil.replace(source, 'arguments;', begin, end + 1);
            
            middle = source.indexOf('0; _i < arguments.length;', middle + 1);
        }
        
        this.compilation.assets[file] = new ConcatSource(source);
    }
    
    complexArgs(file)
    {
        let source = this.createTmpArray(this.compilation.assets[file].source()),
            middle = source.indexOf('; _i < arguments.length;');
        while (middle !==-1)
        {
            const term1 = StringUtil.backSearch(source, '{', middle),
                  term2 = StringUtil.backSearch(source, '}', middle),
                  begin = StringUtil.backSearch(source, '[', middle),
                  end   = begin + 1;
            if (term1 < begin && term2 < begin) {
                source = StringUtil.replace(
                    source,
                    'window.tmpArray.length = 0;\n\
                     var args = window.tmpArray,n = arguments.length',
                    begin - 11, end + 1
                );
                middle = source.indexOf('; _i < arguments.length;');
                source = StringUtil.replace(source, 'n', middle + 7, middle + 23);
            }
            
            middle = source.indexOf('; _i < arguments.length;', middle + 1);
        }
        
        this.compilation.assets[file] = new ConcatSource(source);
    }
    
    createTmpArray(source)
    {
        return 'if (typeof window === "undefined")\
                    var window = global;\
                window.tmpArray = [];' +
                source;
    }
}

module.exports = Main;
