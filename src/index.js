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


  onClick() {
      console.log('onClick')
      this.setState( { num: this.state.num + 1 } );
  }

  render() {
      return (
          <div onClick={ () => this.onClick() }>
              <h1>number: {this.state.num}</h1>
              <button>add</button>
          </div>
      );
  }
}

ReactDom.render(
  <Counter />,
  document.getElementById( 'root' )
);