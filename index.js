const express = require('express')
const {constants: http} = require('http2')

const app = express();

app.use(express.urlencoded());
app.use(express.json());

app.use('/', require('./src/routers'))

app.use("/*splat", (req, res)=>{
  return res.status(http.HTTP_STATUS_FORBIDDEN).json({
    success: false,
    message: 'Not found'
  });  
});

app.listen(8080, ()=>{
  console.log('Listening on port 8080')
})