var _throttle = function(fn, delay){
  var last_call = 0;
  return function(){
    var diff = Date.now() - last_call;
    if(diff>delay){
      fn.apply(null,arguments);
      last_call = Date.now();
    }
  }
}

var _debounce = function(fn, delay){
  var timer = null;
  return function(){
    if(timer){
      clearTimeout(timer)
    }
    timer = setTimeout(fn,delay);
  }
}

var _throttleAndDebounce = function(fn,delay,immediate,debounce){
  var context,
      curr,
      last_call,
      last_exec,
      timer,
      diff,
      args,
      exec = function(){
        last_exec = curr;
        fn.apply(context,args)
      };
  return function(){
    curr = Date.now();
    //这里是重点，last_call 每次触发函数都会更新，而last_exec只有执行fn才会更新
    diff = curr - (debounce?last_call:last_exec) - delay; 
    context = this;
    args = arguments;
    clearTimeout(timer);
    //如果是debounce，证明是需要延迟执行的
    if(debounce){
      //如果不是立即执行，则加入队列
      if(!immediate){
        timer = setTimeout(exec,delay);
      }else if(diff >= 0){
        exec();
      }
    }else{
      //首先判断时间差，如果>0则执行，不论什么情况
      if(diff >= 0 ){
        exec();
      }else if(!immediate){
        timer = setTimeout(exec,-diff)
      }
    }
    last_call = curr;
  }
}