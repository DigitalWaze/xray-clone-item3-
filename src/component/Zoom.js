import React, { Component } from "react";

export default class Zoom extends Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.figureRef=React.createRef();
    this.state = {
      backgroundImage: `url(${this.props.src})`,
      backgroundPosition: '0% 0%',
      zoomable:true,
    }
  }

  

  handleMouseMove = e => {
    if(this.state.zoomable===true)
    {
      const { left, top, width, height } = e.target.getBoundingClientRect()
      const x = (e.pageX - left) / width * 100
      const y = (e.pageY - top) / height * 100
      this.setState({ backgroundPosition: `${x}% ${y}%` })
    }
    
  }

  componentDidMount()
  {
    // console.log(document.getElementById('aaa').width);
  }

  imageLoad = (e) =>
  {
    this.figureRef.current.style.width=(this.myRef.current.width) + 'px' ;
    console.log((this.myRef.current.height) + 'px' )
    this.figureRef.current.style.height=(this.myRef.current.height) +'px';
  }

  handleClick = () =>
  {
    
    if(this.state.zoomable===false)
    {
      this.myRef.current.style.opacity="";
    }
    if(this.state.zoomable===true)
    {
      this.myRef.current.style.opacity=0;
      this.figureRef.current.style.backgroundSize="250% 250%";

    }
    this.setState({zoomable:!this.state.zoomable})
  }


  render = () =>
  <div style={{display:'inline-block',width:'100%',height:'calc(100% - 4px)',verticalAlign:'top'}}>
    {/* <div style={{width:'100%',maxHeight:'100%',height:'100%'}}>  */}
      <div className="zoom-pan">

      <div className="border-wrapper" style={{border:this.props.active?'15px solid #81bd17':null}}>
        <figure id="Myfigure" ref={this.figureRef}  onMouseMove={this.handleMouseMove} onClick={this.handleClick} style={{ marginBottom:'0px',backgroundImage: `url(${this.props.src})`, backgroundPosition: this.state.backgroundPosition}}>
            <img src={this.props.src} ref={this.myRef} id="images" onLoad={this.imageLoad}  alt="xray" />
          </figure>
        </div>
      </div>
        
    {/* </div> */}
  </div>  
  
  
}