export default function appSrc(express, bodyParser, createReadStream, crypto, http, m, User) {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS, DELETE');
    next();
  });

  app.get('/login/', (req, res) => {
    res.send('zdarya');
  });

  app.post('/insert/', async (req, res) => {
    const login = req.query.login || req.body.login;
    const password = req.query.password || req.body.password;
    const URL = req.query.url || req.body.url;
    const newUser = new User({ login, password });

    try {
      await m.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true});
    } catch (e) {
      console.log(e.codeName);
    }

    try {
      await newUser.save();
      
      res.status(201).json({'Добавлено': login});
    } catch (e){
      res.status(400).json({'Ошибка': 'нет пароля'});
    }
  });

  app.get('/code/', (req, res) => {
    const filePath = import.meta.url.substring(7);
    createReadStream(filePath).pipe(res);
  });

  app.get('/sha1/:input/', (req, res) => {
    const input = req.params.input;
    const sha1Hash = crypto.createHash('sha1').update(input).digest('hex');
    res.send(sha1Hash);
  });

  app.all('/req/', (req, res) => {
    const addr = req.query.addr || req.body.addr;
    if (!addr) {
      return res.send('Specify the "addr" parameter');
    }

    http.get(addr, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        res.send(data);
      });
    }).on('error', (err) => {
      res.send('Error: ' + err.message);
    });
  });

  app.all('*', (req, res) => {
    res.send('zdarya');
  });

  return app;
}
