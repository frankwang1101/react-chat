// const asyncFunc1 = (data) => {
//   return new Promise((resolve, reject) => {
//     console.log('etner async1');
//     setTimeout(() => {
//       console.log(data);
//       console.log('start resolve func1');
//       resolve('f1');
//     },1000)
//   })
// }

// const asyncFunc2 = (data) => {
//   return new Promise((resolve, reject) => {
//     console.log('etner async2');
//     setTimeout(() => {
//       console.log(data);
//       console.log('start resolve func2');
//       resolve('f2');
//     },1000)
//   })
// }

// const asyncResult = async function(){
//   console.log('enter async result');
//   const f1 = await asyncFunc1('hello');
//   console.log(f1);
//   const f2 = await asyncFunc2('world');
//   console.log(f2);
//   console.log('after asyncFunc');
//   return 1;
// }

// const asyncResult2 = async () => {
//   const result = await asyncResult();
//   console.log(result);
// }

// asyncResult2();

const fa = async () => {
   const k = await new Promise((r) => {
      console.log('lg4j');
      r('asslk');
    }, 3000)
    console.log(k);
    return 'false';
  
}
fa().then( rs => {
  console.log(rs);
})
