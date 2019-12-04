import {React, ReactDom} from './kyReact'
// const element = (
//   <div className='index' data='1111'>
//       hello1111<span>world!</span>
//       {new Date().toLocaleTimeString()}
//   </div>
// );
// console.log(element);

// ReactDom.render(element, document.getElementById('root'))

// function tick() {
//   const element = (
//       <div className='index' data='1111'>
//           <h1 style={{color:'red'}}>Hello, world!</h1>
//           <h2>It is {new Date().toLocaleTimeString()}.</h2>
//       </div>
//     );
//     ReactDom.render(
//       element,
//       document.getElementById('root')
//   );
// }

// // setInterval( tick, 1000 );
// // tick()

// class Welcome extends React.Component {
//   render() {
//       return <h1>Hello, {this.props.name}</h1>;
//   }
// }
function Welcome( props ) {
  return <h1>Hello, {props.name}</h1>;
}
const element2 = <Welcome name="Sara" />;
function App({data}) {
  return (
      <div>
          <Welcome name="Sara" name={data}/>
          <Welcome name="Cahal" />
          <Welcome name="Edite" />
      </div>
  );
}
console.log(element2)
// ReactDom.render(<App data='111'/>, document.getElementById('root'))


class Counter extends React.Component {
  constructor( props ) {
      super( props );
      this.state = {
          num: 0
      }
  }

  componentWillUpdate() {
    console.log('update');
  }

  componentDidMount() {
    console.log('did mount');
    // for ( let i = 0; i < 100; i++ ) {
    //   this.setState( { num: this.state.num + 1 } );
    //   console.log( this.state.num );    // 会输出什么？
    // }
  //   for ( let i = 0; i < 100; i++ ) {
  //     this.setState( prevState => {
  //         console.log( prevState.num );
  //         return {
  //             num: prevState.num + 1
  //         }
  //     } );
  // }
  }

  onClick() {
      this.setState( { num: this.state.num + 1 } );
  }

  render() {
      return (
          <div>
              <h1>number: {this.state.num}</h1>
              <button onClick={ () => this.onClick() }>add</button>
              <div>{[1,2,3].map((el,index)=>(<span key={"x"+index}>{el}</span> ))}</div>
              {/* <div>{[1,2,3].map((el,index)=>{ <span key={"x"+index}>{el}</span>  })}xxx
{[4,5,6].map((el,index)=>{ <span key={"x"+index}>{el}</span>  })}</div> */}
          </div>
      );
  }
}

ReactDom.render(
  <Counter />,
  document.getElementById( 'root' )
);