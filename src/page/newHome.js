import React, { Component } from 'react';
import { getMyImage, getImage, getNewImage} from "../Firebase";
import HipOnly from './HipOnly';
import HipFrog from './HipFrog';
import {Loader} from "../component/Loader";



class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { view:null,loading:true,xray: { key:"", value:{}}, }
    }

    prevImage = async () =>
    {
        this.setState({view:null,loading:true})
        let xray = this.state.xray;
        let oldKey=xray.key;
        let new_xray=null;
        let view=null;

        if(xray && xray.value && xray.value.backImage){
            new_xray = await getImage(xray.value.backImage);
        }
        else new_xray=null;
        if(new_xray && new_xray.value){
           
            if(new_xray.value.Hip)
            { 
                if(new_xray.value.RightFrog===true || new_xray.value.LeftFrog===true)
                {
                    view="HipFrog"
                }

                else
                {
                    view="HipOnly"
                }
            }
            else
            {
                // console.log('Image Deleted')
                if(oldKey===new_xray.value.nextImage)
                {
                    alert('No Back Image Found');
                }
                this.nextImageAfterDeleted(xray);

            }

        }
       
        this.setState({xray:new_xray,view,loading:false})    

    }

    nextImage = async () => 
    {
        this.setState({view:null,loading:true})
        let xray = this.state.xray;
        let new_xray=null;
        let view=null;
        if(xray && xray.value && xray.value.nextImage)
        {
            // console.log('nextImage')
            new_xray = await getImage(xray.value.nextImage);           
        }
        else {
            // console.log('newImage')
            new_xray = await getNewImage(xray.key);

            if(new_xray && new_xray.value)
            {
                new_xray.value.backImage =localStorage.getItem("oldKey");
            }
        }

        // console.log(new_xray)

        if(new_xray && new_xray.value){
            
            if(new_xray.value.RightFrog===true || new_xray.value.LeftFrog===true)
            {
                view="HipFrog"
            }

            else
            {
                view="HipOnly"
            }
            // console.log(view)

            new_xray.value.backImage =localStorage.getItem("oldKey");
            

        }
        
            this.setState({view,xray:new_xray,loading:false,})
        
    
    }

    async componentDidMount()
    {
        let xray = await getMyImage();
        let view=null;
        if(xray == null || xray.value == null){
            // console.log('old null')
            var oldkey = localStorage.getItem("oldKey") || "";
            xray =  await getNewImage(oldkey);
            if(xray && xray.value && !xray.value.backImage){
                xray.value.backImage = oldkey;
            }
        }

        if(xray && xray.value)
        {
            if(xray.value.RightFrog===true || xray.value.LeftFrog===true)
            {
                // console.log('view : HipFrog')
                view='HipFrog';
            }

            else
            {
                // console.log('view : HipOnly')
                view='HipOnly';
                
            }

        }
        this.setState({view,xray,loading:false})
        
    }
    render() { 
        const xray=this.state.xray
        if(xray==null || xray.value==null){
            return (
                <section>
                     {this.props.isAdmin && (
                    <button className="button-confirm w-button" onClick={()=>{
                        this.props.history.push("/Manage");
                    }} style={{position:"fixed", top:20, right:50, left:"auto", bottom:"auto"}}> Upload</button>)}
                    <h2>No Data Found</h2>
                </section>
            );
        }
        return (
            <div>
                {this.props.isAdmin && (
                <button className="button-confirm w-button" onClick={()=>{
                    this.props.history.push("/Manage");
                }} style={{position:"fixed", top:20, right:50, left:"auto", bottom:"auto"}}> Upload</button>)}
                <div className="columns-6 w-row">
                    <div className="column-right-padding w-col w-col-7">
                        <h3 className="heading-4">SBS X-ray Review</h3>
                    </div>
                    <div className="w-col w-col-5">
                        <p className="small-paragraph">Patient Reference Number: {this.state.xray?this.state.xray.value.RefNum:null}</p>
                    </div>
                </div>

                {this.state.loading===true?
                    
                    <Loader  loading={true}/>
        
                :this.state.view==="HipFrog"?

                    <HipFrog xray={this.state.xray} nextImage = {this.nextImage} prevImage={this.prevImage}/>

                :this.state.view==="HipOnly"?

                    <HipOnly xray={this.state.xray} nextImage = {this.nextImage} prevImage={this.prevImage}/>
                :
                <div>

                </div>
                } 
            </div>

         );
    }
}
 
export default Home;