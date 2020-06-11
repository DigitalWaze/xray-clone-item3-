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

        this.csvTitle = "User ID,X-ray Name,Date Completed,Pelvis Right Zone 1,Pelvis Right Zone 2,Pelvis Right Zone 3,Pelvis Left Zone 1,Pelvis Left Zone 2,Pelvis Left Zone 3,X-ray Error,Notes,Side,Lateral Zone 1,Lateral Zone 2,Lateral Zone 3,X-ray Error,Notes";
        this.fileTitle = "hips-xray-evaluation";
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

            if(result[i].Hip==true)
            {
                let Rzone1= rates[result[i].RightHipImage.zone1] || "";
                let Rzone2= rates[result[i].RightHipImage.zone2] || "";
                let Rzone3= rates[result[i].RightHipImage.zone3] || "";

                let Lzone1= rates[result[i].LeftHipImage.zone1] || "";
                let Lzone2= rates[result[i].LeftHipImage.zone2] || "";
                let Lzone3= rates[result[i].LeftHipImage.zone3] || "";
                let rightNotes = result[i].rightNotes;
                let leftNotes = result[i].leftNotes;
                let notes='Right Hip: '+(rightNotes || "")+' Left Hip: '+(leftNotes||"");
                // let newLine1=""
                // if(notes[0])
                // {
                //     newLine1 = 'Right Hip: '+notes[0];
                // }
                // console.log(newLine1)
                // let newLine3=""
                // if(notes[2])
                // {
                //     newLine3 = 'Left Hip: '+notes[2];
                // }
                
                
                // let newNotes=newLine1;
                // for(let j=1;j<notes.length;j++)
                // {
                //     if(j==2)
                //     {
                //         newNotes=newNotes+ " " + newLine3;
                //     }
                //     else newNotes=newNotes+ " " +notes[j];
                // }


                this.csv.push(
                (result[i].userName || result[i].evaluator) +"," +
                result[i].HipImage.ImageName +","+
                (new Date(result[i].evaluatedOn)).toLocaleDateString() +","+
                Rzone1 +","+
                Rzone2 +","+
                Rzone3 +","+
                Lzone1 +","+
                Lzone2 +","+
                Lzone3 +","+
                (result[i].isError ? "Error":"") +","+
                notes
                );
            }

            if(result[i].RightFrog===true)
            {
                console.log("Right")

                let zone1= rates[result[i].RightFrogImage.zone1] || "";
                let zone2= rates[result[i].RightFrogImage.zone2] || "";
                let zone3= rates[result[i].RightFrogImage.zone3] || "";
            
                console.log(result[i].RightFrogImage.comment)
                this.csv.push(
                (result[i].userName || result[i].evaluator) +"," +
                result[i].RightFrogImage.ImageName +","+
                (new Date(result[i].evaluatedOn)).toLocaleDateString() +","+

                " " +","+
                " " +","+
                " " +","+
                " " +","+
                " " +","+
                " " +","+
                (result[i].isError ? "Error":"") +","+
                // result[i].comment+","+
                " " +","+   //notes line
                "Right"+","+
                zone1+","+
                zone2+","+
                (zone3 || "")+","+
                " " +","+
                (result[i].RightFrogImage.comment|| "")
                );
            }

            if(result[i].LeftFrog===true)
            {
                console.log("Left")

                let zone1= rates[result[i].LeftFrogImage.zone1] || "";
                let zone2= rates[result[i].LeftFrogImage.zone2] || "";
                let zone3= rates[result[i].LeftFrogImage.zone3] || "";
                
                this.csv.push(
                (result[i].userName || result[i].evaluator) +"," +
                result[i].LeftFrogImage.ImageName +","+
                (new Date(result[i].evaluatedOn)).toLocaleDateString() +","+

                " " +","+
                " " +","+
                " " +","+
                " " +","+
                " " +","+
                " " +","+
                (result[i].isError ? "Error":"") +","+
                " " +","+
                "Left"+","+
                zone1 +","+
                zone2 +","+
                zone3 +","+
                " "+","+
                (result[i].LeftFrogImage.comment || "")
                );
            }
            // this.csv.push(
            //     (result[i].userName || result[i].evaluator) +"," +
            //     result[i].imageName +","+
            //     (new Date(result[i].evaluatedOn)).toLocaleDateString() +","+
            //     rates[result[i].rightLateral] +","+
            //     rates[result[i].rightMedial] +","+
            //     rates[result[i].leftMedial] +","+
            //     rates[result[i].leftLateral] +","+
            //     (result[i].isError ? "Error":"") +","+
            //     result[i].comment
            //     );
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