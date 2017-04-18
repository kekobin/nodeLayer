# nodeLayer
> 一个介于前端与后端之间的中间层，该中间层用于访问后台(如php、j   ava)数据，并将访问的返回结果渲染到本地模版中，提供(直出)给浏览器。

具体理念如图所示:

![](http://gtms03.alicdn.com/tps/i3/T1xW8OFrXkXXXK71TW-590-611.png) 

## Usage

##开发模式:

###步骤一:


```shell
gulp serve -n projectName
```  

'-n projectName' 是必须的，指定当前开发的项目名称，如'-n nodeLayerDemo',那么系统将自动生成其静态资源目录和node中间层级目录：

![](http://upload-images.jianshu.io/upload_images/639270-712400bad110ed8f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

其中，'nodeLayerDemo/'为静态资源目录，'nodeLayerDemoView/'为视图和模版目录。

###步骤二:
当需要使用到接口访问数据时，在'config/projectConfig.js'中配置好对应的接口以及接口返回数据的标识：

![](http://upload-images.jianshu.io/upload_images/639270-db3918ad07c8939b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)  

这样你就能够获取到名为'data1'的接口数据，直接应用到模版中。

如果你需要在前端复用node层的模版，也非常的简单，使用框架全局方法Helper.template(项目名,'template/' + 模版名)即可：

![](http://upload-images.jianshu.io/upload_images/639270-f9246ba4eca71b4b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  
  
###步骤二:

现在，即可在浏览器中访问到创建好的项目了: [http://localhost:3000/nodeLayerDemo]  

##生产模式:

当完成项目开发时，使用如下命令发布代码:

```shell
gulp build
```    
它将打包生成如下目录:  

![](http://upload-images.jianshu.io/upload_images/639270-f05b3ac3c24a18a0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

其中，'nodeLayerDemo'属于静态资源，直接发布到CDN;'nodeLayerDe moView'是node层级目录，发布到node server！

至此，一个node中间层的开发到发布流程完结了！

## License

http://en.wikipedia.org/wiki/MIT_License[MIT License]