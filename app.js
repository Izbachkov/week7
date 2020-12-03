  
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers':
    'x-test,Content-Type,Accept, Access-Control-Allow-Headers',
};

export default function appSrc(express, bodyParser, createReadStream, crypto, http, m, UserSchema) {
  const app = express();

  const User = m.model('User', UserSchema);

  app
    .use((req, res, next) => {
      res.set(CORS);
      next();
    })
  
    .use(bodyParser.urlencoded({ extended: true }))
  
    .get('/sha1/:input', (req, res) => {
      let hash = crypto.createHash('sha1');
      hash.update(req.params.input);
      res.send(hash.digest('hex'));
    })

    .get('/login/', (req, res) => res.send('strax5'))
  
    .get('/code/', (req, res) => {
      let filename = import.meta.url.substring(7);
      createReadStream(filename).pipe(res);
    });

  app.post('/insert/', async (req, res) => {
    const { URL, login, password } = req.body;
      try {
        await m.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
      } catch (e) {
        res.send(e.stack);   
      }
    const myUser = new User({ login, password });
    await myUser.save();
    res.status(201).json({ successsss: true, login });
    }); 

  app.all('/req/', (req, res) => {
    let url = req.query.addr;
    http.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => (data += chunk));
      response.on('end', () => {
        res
          .set({
            'Content-Type': 'text/plain; charset=utf-8',
          })
          .end(data);
      });
    });
  });
  
  app.all('*', (req, res) => {
    res.send('strax5');
  });
  
  return app;
}
