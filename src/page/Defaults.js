import React from "react";
import {rates} from "./Home";
import { getDefaultRates, setDefaultRates } from "../Firebase";
import {CheckBox} from "../component/CheckBox";

export default class Defaults extends React.Component{
    constructor(props){
        super(props);
        this.state={
            config: {
                leftLateral: null,
                rightLateral: null,
                leftMedial: null,
                rightMedial: null
            },
            key: ""
        }
    }
    async componentDidMount(){
        let data = await getDefaultRates();
        this.setState({config: data.value, key: data.key});
    }
    handleCheck = (checked, field, value) =>{
        let {config} = this.state;
        config[field] = checked ?  value : "";
        this.setState({config});        
    }

    render(){
        let {config} = this.state;
        return (
            <section>
                <div className="w-row">
                    <div className="w-col w-col-6 column-5">
                    <button className="button-confirm w-button" onClick={()=>{
                        this.props.history.push("/Home");
                    }}> Start Evaluation</button>     
                    </div>
                    <div className="w-col w-col-6 column-4">
                    <button className="button-confirm w-button" onClick={()=>{
                        this.props.history.push("/Manage");
                    }}> Upload</button>     
                    </div>                    
                    
                </div>
                <div className="w-row">
                    
                
            <table className="tablet">
                   <tbody>
                   <tr>
                       <td></td>
                       <td>
                            <p className="table-text c">Right Lateral</p>
                        </td>
                       <td >
                            <p className="table-text c">Right Medial</p>
                       </td>
                       <td>
                            <p className="table-text c">Left Medial</p>
                        </td>
                       <td>
                            <p className="table-text c">Left Lateral</p>
                        </td>
                        <td></td>                       
                   </tr>
                   {config && rates.map(i=>
                    (<tr key={i.value}>
                       <td style={{verticalAlign:"bottom"}}>
                           <p className="table-text">{i.name}</p>
                        </td>                        
                       <td><CheckBox checked={config.rightLateral===i.value} 
                            onChange={(checked)=>{this.handleCheck(checked, "rightLateral", i.value)}}/></td>
                       <td><CheckBox checked={config.rightMedial===i.value}
                            onChange={(checked)=>{this.handleCheck(checked, "rightMedial", i.value)}}/></td>
                       <td><CheckBox checked={config.leftMedial===i.value}
                            onChange={(checked)=>{this.handleCheck(checked, "leftMedial", i.value)}}/></td>
                       <td><CheckBox checked={config.leftLateral===i.value}
                            onChange={(checked)=>{this.handleCheck(checked, "leftLateral", i.value)}}/></td>
                       <td>                        
                       </td>
                   </tr>)
                   )}       
                   <tr>
                       <td colSpan="6">
                           <button className="button-confirm w-button" onClick={async ()=>{
                               let res = await setDefaultRates(this.state.config)
                               if(res){
                                   alert("Save successfully!");
                               }
                               else {
                                   alert("Failed to save the configuration");
                               }
                           }}>Submit</button>
                       </td>
                    </tr>                               
                   </tbody>
               </table>
               </div>
               </section>

        )
    }
}