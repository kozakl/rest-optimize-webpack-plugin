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
        let source = this.compilation.assets[file].source(),
            middle = source.indexOf('arguments.length; _i');
        while (middle !==-1)
        {
            const term1 = StringUtil.backSearch(source, '{', middle),
                  term2 = StringUtil.backSearch(source, '}', middle),
                  begin = StringUtil.backSearch(source, '[', middle),
                  end   = source.indexOf('}', middle);
            if (term1 < begin && term2 < begin)
                source = StringUtil.replace(source, 'arguments;', begin, end + 1);
            
            middle = source.indexOf('arguments.length; _i', middle + 1);
        }
        
        this.compilation.assets[file] = new ConcatSource(source);
    }
}

module.exports = Main;
