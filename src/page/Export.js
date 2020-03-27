import React from "react";
import {Loader} from "../component/Loader";
import { getAllEvaluated } from "../Firebase";

const rates = {
    1: "Normal/Slight",
    2: "Moderate",
    3: "NES",
    4: "End Stage",
    5: "Replaced"
}


export default class Export extends React.Component{    
    constructor(props){
        super(props);
        this.state ={
            loading:true
        }

        this.csvTitle = "User ID,X-ray Name,Date Completed,Right Lateral,Right Medial,Left Medial,Left Lateral,X-ray Error,Notes";
        this.fileTitle = "xray-evaluation";
        this.csv=[];
    }
    ExportToCSV = ()=>{
        var exportedFilenmae = this.fileTitle + '.csv' || 'export.csv';

        var blob = new Blob([this.csvTitle +"\r\n"+ this.csv.join("\r\n")], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, exportedFilenmae);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFilenmae);
                link.style.visibility = 'hidden';
                var div = document.getElementById("csvLink");
                div.appendChild(link);
                link.click();
                div.removeChild(link);
            }
        }
    }
    async componentDidMount(){
        var result = await getAllEvaluated();
        this.csv=[];
        for(var i=0;i<result.length;i++){
            this.csv.push(
                (result[i].userName || result[i].evaluator) +"," +
                result[i].imageName +","+
                (new Date(result[i].evaluatedOn)).toLocaleDateString() +","+
                rates[result[i].rightLateral] +","+
                rates[result[i].rightMedial] +","+
                rates[result[i].leftMedial] +","+
                rates[result[i].leftLateral] +","+
                (result[i].isError ? "Error":"") +","+
                result[i].comment
                );
        }     

        this.ExportToCSV();
        this.setState({loading:false});
        this.props.history.push("/Home");
    }
    render(){
        return (
            <section>
                <Loader loading={this.state.loading}/>
                <div id="csvLink"></div>               
            </section>
        )
    }
}