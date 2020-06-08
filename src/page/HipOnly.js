import React, { Component } from 'react';
import { getMyImage, getNewImage, saveImage, getImage, DeleteImage , DeleteCurrentImage ,currentUser} from "../Firebase";
import LeftZone from '../assets/Left Hip.png'
import RightZone from '../assets/Right Hip.png'
import Zoom from "../component/Zoom";
import { CheckBox } from "../component/CheckBox";
import {Note} from "../component/Note";
// import SwipeableViews from 'react-swipeable-views';



export const rates = 
    [{name: "Normal/Slight", value: 1},
    {name: "Moderate", value: 2},
    {name: "NES", value: 3},
    {name: "End Stage", value: 4},
    {name: "Replaced", value: 5}];

class HipOnly extends Component {
    constructor(props) {
        super(props);
        this.state = {xray:null,activeSide:null,left:null,loading:true,index:0  }
    }
    componentWillMount()
    {
        this.setComponent();
    }

    leftHip =()=>
    {
        if(this.state.activeSide==="Left")
        {
            return;
        }
        if(this.state.activeSide==="Right")
        {    
            this.setState({
                left:true,
                activeSide:'Left',
                index:1
            })
    
        }
    }

    rightHip =()=>
    {
        if(this.state.activeSide==="Right")
        {
            return;
        }
        if(this.state.activeSide==="Left")
        {    
            this.setState({
                left:false,
                activeSide:'Right',
                index:0
            })
    
        }
    }

    prevImage = async() =>
    {
        let xray = this.state.xray;
        if(xray.value.isError && xray.value.comment==="")
        {
            alert('Please add note about error');
            return;
        }
        else
        {
            await this.saveChanges(xray.key, xray.value);
            // this.setState({activeSide:"Right",left:false,loading:false});
            this.props.prevImage(); 
            // this.setComponentBack();

            return;
        }

    }

    saveChanges = async () =>
    {
        let xray=this.state.xray;
    
        this.setState({loading:true});
        localStorage.setItem("oldKey", xray.key);
        xray.value.rightStatus = 3;
        xray.value.leftStatus=3;
        xray.value.status =3
        xray.value.evaluatedOn = (new Date()).toJSON();
        xray.value.evaluator= currentUser().uid;
        xray.value.userName= currentUser().email.toString() || currentUser().userName.toString();
        
        await saveImage(xray.key, xray.value);
        this.setState({loading:false});

    }

    nextImage = async () =>
    {
        let xray = this.state.xray;
        if(xray.value.isError && xray.value.comment==="")
        {
            alert('Please add note about error');
            return;
        }
        else
        {        
            await this.saveChanges();
            this.props.nextImage(); 
            this.setComponent();
            // this.setState({activeSide:"Right",left:false});
            return;
        }

    }

    handleCheck = (checked, field, value) =>{
        let xray = this.state.xray;
        const activeTable = this.state.activeSide==="Right" ? "RightHipImage" : this.state.activeSide==="Left" ? "LeftHipImage" : null;

        if(xray.value[activeTable].zone1==5)
        {
            xray.value[activeTable].zone1=""
            xray.value[activeTable].zone2=""
            xray.value[activeTable].zone3=""
        }

        xray.value[activeTable][field]= checked ?  value : null;
        this.setState({xray});
    }

    handleCheckAll = (checked, value) =>{
        let {xray} = this.state;
        const activeTable = this.state.activeSide==="Right" ? "RightHipImage" : this.state.activeSide==="Left" ? "LeftHipImage" : null;
        xray.value[activeTable].zone1= checked ?  value : null;
        xray.value[activeTable].zone2= checked ?  value : null;
        xray.value[activeTable].zone3= checked ?  value : null;
        this.setState({xray});
    }

    setComponent = () =>
    {
        let xray=this.props.xray;
        let activeSide=null;
        let left=null;
       

        if(xray && xray.value )
        {
            activeSide="Right"
            left=false;
            this.setState({xray,activeSide,left});    
        }
        else
        {
            this.setState({xray,loading:false});
        }
    }

    
      handleChangeIndex = index => {
        this.setState({
          index,
        });
      };
    
    

   
    render() { 
        const xray = this.state.xray;
        const lB = this.state.left;
        const global = this;
        const activeTable = this.state.activeSide==="Right" ?  "RightHipImage" : this.state.activeSide==="Left" ? "LeftHipImage" : null;
        function Table()
        {
            return(
                
                xray.value.Hip===true?
                
                <table className="tablet">
                    <tbody>
                        <tr>
                            <td  style={{verticalAlign:'bottom'}}></td>
                            <td colspan="3" style={{borderLeft:'1px solid white',borderRight:'1px solid white',verticalAlign:'bottom'}}>
                                <div style={{width:'50%',background:'',height:'57px',textAlign:'center',marginBottom:'-1px',verticalAlign:'bottom',display:'inline-block',borderTop:'1px solid white',borderRight:'1px solid white',borderBottom:lB?'1px solid white':null}}>
                                    <a className="button-confirm w-button" onClick={global.rightHip} style={{marginRight:30,borderWidth:!lB?3:0,borderColor:!lB?'white':'none',borderStyle:!lB?'solid':'none'}}>Right Hip</a>
                                </div>

                          
                                <div style={{width:'50%',background:'',height:'57px',marginBottom:'-1px',verticalAlign:'bottom',display:'inline-block',borderBottom:!lB?'1px solid white':null,borderTop:'1px solid white'}}>
                                    <a className="button-confirm w-button" onClick={global.leftHip} style={{ marginLeft:30,borderWidth:lB?3:0,borderColor:lB?'white':'none',borderStyle:lB?'solid':'none'}}>Left Hip</a>
                                </div>
                            
                            
                            </td>
                            
                        </tr>
                        <tr style={{borderLeft:'1px solid white'}}>
                            <td  style={{borderTop:'1px solid white',verticalAlign:'bottom'}}></td>
                            <td>
                                    <p className="table-text c">Zone 1</p>
                            </td>
                            <td >
                                    <p className="table-text c">Zone 2</p>
                            </td>
                            <td style={{borderRight:'1px solid white'}}>
                                    <p className="table-text c">Zone 3</p>
                            </td>
                            <td>
                                <a  className="view-report button-7 w-button"
                                    onClick={()=>{
                                        xray.value.isError = true;
                                        global.setState({addNote:true, xray})
                                    }}>X-ray Error
                                </a>
                            </td>
                        </tr>
                        {rates.map(i=>
                            (<tr key={i.value} style={{borderLeft:'1px solid white'}}>
                                <td style={{verticalAlign:"bottom"}}>
                                    <p className="table-text">{i.name}</p>
                                    </td>
                                   
                                    {
                                        i.value<5?
                                        <td><CheckBox checked={xray.value[activeTable].zone1===i.value} 
                                        onChange={(checked)=>{global.handleCheck(checked, "zone1", i.value)}}/></td>
                                        :
                                        <td><span style={{display:'inline-block',borderBottom:'1px white solid',height:'41px',width:'100%',verticalAlign:"bottom"}}> </span></td>
                                    }
                                    {
                                        i.value<5?
                                        <td><CheckBox checked={xray.value[activeTable].zone2===i.value} 
                                        onChange={(checked)=>{global.handleCheck(checked, "zone2", i.value)}}/></td>:
                                        
                                        <td><CheckBox checked={xray.value[activeTable].zone1===i.value}
                                        onChange={(checked)=>{global.handleCheckAll(checked,  i.value)}}/></td>
                                    }
                                    {
                                        i.value<5?
                                        <td style={{borderRight:'1px solid white'}}><CheckBox checked={xray.value[activeTable].zone3===i.value} 
                                        onChange={(checked)=>{global.handleCheck(checked, "zone3", i.value)}}/></td>:
                                        <td><span style={{display:'inline-block',borderBottom:'1px white solid',height:'41px',width:'calc(100% + 1px)',verticalAlign:"bottom",borderRight:'1px solid white'}}> </span></td>
                                    }
                                
                                <td>
    
                                    {i.value===5 && (<a href="#" className="view-report button-7 green w-button"
                                        onClick={()=>global.setState({addNote:true})}>Add Note</a>)}
                                    {/* {i.value===3 && (<a href="#" className="view-report button-7 red w-button"
                                        onClick={this.delete}>Delete</a>)} */}
                                </td>
                            </tr>)
                        )}
                    </tbody>
                </table>
                :null
    
            )
        }
        return (  
        <div>
            <div style={{display:'block',height:'280px'}}>
                {
                    this.state.activeSide==='Right'?
                    <span style={{width:'25%',display:"inline-block",verticalAlign:'top',marginRight:'9%'}}>
                        <img src={RightZone}  alt="ZONES" style={{width:'100%',height:220,borderWidth:!lB?3:0,borderColor:!lB?'white':'none',borderStyle:!lB?'solid':'none'}}/>
                    </span>
                    :this.state.activeSide==='Left'?
                    <span style={{width:'25%',display:"inline-block",verticalAlign:'top',marginRight:'9%'}}>
                        <img src={LeftZone}  alt="ZONES" style={{width:'100%',height:220,borderWidth:lB?3:0,borderColor:lB?'white':'none',borderStyle:lB?'solid':'none'}}/>
                    </span>
                    :null
                }
                {xray.value.Hip===true?
                    <span style={{width:'50%',display:"inline-block",}}>
                        <Zoom src={xray.value.HipImage.imageUrl.imageUrl} style={{width:'98%',height:"180px",marginRight:0,marginLeft:'2%'}}/>
                    </span>
                :null
                }
                {/* <div>
                    <a className="button-confirm w-button" onClick={this.rightHip} style={{marginRight:30,borderWidth:!lB?3:0,borderColor:!lB?'white':'none',borderStyle:!lB?'solid':'none'}}>Right Hip</a>
                    <a className="button-confirm w-button" onClick={this.leftHip} style={{ marginLeft:30,borderWidth:lB?3:0,borderColor:lB?'white':'none',borderStyle:lB?'solid':'none'}}>Left Hip</a>
                </div> */}

            </div>
            

            <div>
                <Table />
            </div>
            
            
            

            <a className="button-confirm w-button" onClick={this.prevImage} style={{position:"fixed", left:50, bottom:20}}>Back</a>
            <a className="button-confirm w-button" onClick={this.nextImage} style={{position:"fixed", left:"auto", right:50, bottom:20}}> Next </a >
            
            <Note show={this.state.addNote} onSubmit={(value)=>{
            xray.value.comment = value;
            this.setState({addNote:false, xray})
            }} onCancel={()=>{
                xray.value.isError= false;
                this.setState({addNote:false, xray})
                }} 
            />
        </div> );
    }
}
 
export default HipOnly;