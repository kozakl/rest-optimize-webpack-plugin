/**
 * @author kozakluke@gmail.com
 */
class StringUtil
{
    static replace(str, insert,
                        start,
                        end) {
        return str.substring(0, start) + insert +
               str.substring(end);
    }
    
    static backSearch(str, searchChar,
                           position) {
        for (let i = position; i--;) {
            if (str[i] === searchChar)
                return i;
        }
    }
}

module.exports = StringUtil;
