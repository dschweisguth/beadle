// Makes dotenv work when this program is run outside the project root
import path from 'path'
import url from 'url'
process.chdir(path.dirname(url.fileURLToPath(import.meta.url)) + '/..')
