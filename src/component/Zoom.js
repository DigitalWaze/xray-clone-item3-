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
      backgroundSize:250,
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
      this.figureRef.current.style.backgroundSize=`${this.state.backgroundSize}%  ${this.state.backgroundSize}%`;

    }
    this.setState({zoomable:!this.state.zoomable})
  }




  wheel = (e) =>
  {
    e.persist();
    console.log(e);

    var zoomOut;

    zoomOut= e.deltaY>0;
    console.log(zoomOut)

    if(zoomOut==true)
    {
      if(this.state.backgroundSize>100)
      {let backgroundsize=this.state.backgroundSize-5;
      this.figureRef.current.style.backgroundSize=`${this.state.backgroundSize-5}%  ${this.state.backgroundSize-5}%`;

      this.setState({backgroundSize:backgroundsize})}
    }

    else
    { 
     
      let backgroundsize=this.state.backgroundSize+5;
      this.figureRef.current.style.backgroundSize=`${this.state.backgroundSize+5}%  ${this.state.backgroundSize+5}%`;

      this.setState({backgroundSize:backgroundsize})
    }
    // var delta = e.delta || e.originalEvent.wheelDelta;
    // var zoomOut;
    // if (delta === undefined) {
    //   //we are on firefox
    //   delta = e.originalEvent.detail;
    //   zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
    //   zoomOut = !zoomOut;
    // }
    
    // else {
    //   zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
    // }

    // if(zoomOut)
    // {
    //     //we are zooming out
    //   //not interested in this yet
    //   console.log("ZoomOut")
    // }
    // else{

    //   console.log("ZoomIn")
    // }

  }

  mouseEnter = (e) =>
  {
    this.figureRef.current.style.backgroundSize=`${this.state.backgroundSize}%  ${this.state.backgroundSize}%`;
  }


  render = () =>
  <div style={{display:'inline-block',width:'100%',height:'calc(100% - 4px)',verticalAlign:'top'}}>
    {/* <div style={{width:'100%',maxHeight:'100%',height:'100%'}}>  */}
      <div className="zoom-pan">

      <div className="border-wrapper" style={{border:this.props.active?'15px solid #81bd17':null}}>
        <figure id="Myfigure" ref={this.figureRef} onMouseEnter={this.mouseEnter} onWheel = {(e) => this.wheel(e)} onMouseMove={this.handleMouseMove} onClick={this.handleClick} style={{ marginBottom:'0px',backgroundImage: `url(${this.props.src})`, backgroundPosition: this.state.backgroundPosition}}>
            <img src={this.props.src} ref={this.myRef} id="images" onLoad={this.imageLoad}  alt="xray" />
          </figure>
        </div>
      </div>
        
    {/* </div> */}
  </div>  
  
  
}