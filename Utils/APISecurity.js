const BlockBrowser = handler => {
    return async (req, res) => {
      if(req.headers.dude === "itsme"){
          req.user = {user:'karim'}
          return handler(req, res);
      }else{
        return res.status(404).send("Error 404")
      }
    };
  }

  export default BlockBrowser;