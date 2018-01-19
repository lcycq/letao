/**
 * Created by Administrator on 2018-1-14.
 */

    //初始化页面区域滚动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    mui('.mui-scroll').slider({
        interval: 1000
    })

    //封装获取url中的参数的函数
    var Tools = {
        getSearchObj: function(){
            //获取当前页面的url
            var url = location.search;
            //去掉？
            url = url.slice(1);
            //对字符串进行解码
            url = decodeURI(url);
            //对&进行拆分，生成数组
            var arr = url.split('&');
            //遍历数组，拆分
            var obj = {};
            for(var i = 0; i < arr.length; i++){
                var key = arr[i].split('=')[0];
                var value = arr[i].split('=')[1];
                obj[key] = value;
            }
            return obj;
        },
        getSearch: function(key){
            var obj = this.getSearchObj();
            return obj[key];
        }
    };
