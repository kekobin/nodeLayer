# nodeLayer
> A node interlayer between frontend and backend, which functions as request data from backend, such as java,php, etc, and provide views to browser directly with combining data and templates in this layer.

## Usage

In development mode:

```shell
gulp serve -n projectName
```  
The '-n projectName' is necessary, which is using for constructing project directory, and will be as a root path in static sources' links of html or ejs.  

For example, 'gulp serve -n demo' will run a server and create a structure as below:  

![](http://img.hb.aicdn.com/a2b5481431908bd050955dc9eb244036ec634c182d42-Aup4GB_fw658)  

Static sources are placing bellow 'public/demo'. Views and templates are in 'views/demoView', where the entry is 'views/demoView/index.ejs'.

When you need to request for data, you should config request urls in 'config/projectConfig.js',which looks as :

![](http://img.hb.aicdn.com/dda153659ee872a84b4dd96f7521862eca6f07166039-GM0G1t_fw658)  

and this will get a response with an object which names  as 'data0', 'data1', etc.You can use them in your templates directly.

If you want to reuse a template, it is also simple.
For example:  

![](http://img.hb.aicdn.com/bed0512e2da8c517c5dfc8c88835292e0a4b98974630-95KlFq_fw658)
  
Then you can view your project in browser with: [http://localhost:3000/demo]  

When you want to publish your project, just use:

```shell
gulp build
```    
This will get a dest directory:  

![](http://img.hb.aicdn.com/7b0d6fc2ab394f15d46c852045aba1e733a10ab7e92-JTndym_fw658)

In which, 'assets/' should be uploading to CDN, and 'demoView/' should be deploying on a Node server!

## License

http://en.wikipedia.org/wiki/MIT_License[MIT License]