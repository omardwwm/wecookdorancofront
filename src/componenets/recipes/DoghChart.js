import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

const DoughChart =(props)=>{

    ChartJS.register(ArcElement, Tooltip, Legend);
    let nutrifacts = props.nutriFacts;
    // console.log(nutrifacts && nutrifacts[0].recipeClories);
    if(nutrifacts){
    }
    const recipeCalories = nutrifacts && nutrifacts[0].recipeClories;
    const recipeCarbohyd = nutrifacts && nutrifacts[0].recipeCarbohydes;
    const recipeProteines = nutrifacts && nutrifacts[0].recipeProteines;
    const recipeFiber = nutrifacts && nutrifacts[0].recipeFiber;
    const recipeFat = nutrifacts && nutrifacts[0].recipeFat;

    const data = {
        // labels: ['Calories','Glucides','Proteines','Lipidees'],
        labels: ['Glucides','Proteines','Lipidees', 'Fibres'],
        datasets: [
            {
                label: 'Valeurs nutritionnelles',
                // data: [recipeCalories,recipeCarbohyd,recipeProteines,recipeFat],
                data: [recipeCarbohyd,recipeProteines,recipeFat,recipeFiber],
                borderColor: ['rgba(255,206,86,0.2)'],
                backgroundColor: ['rgba(232,99,132,1)',
                'rgba(232,211,6,1)',
                'rgba(54,162,235,1)',
                // 'rgba(255,159,64,1)',
                'rgba(153,102,255,1)' ],
                pointBackgroundColor: 'rgba(255,206,86,0.2)',
                // backgroundImage: 'lightblue url("https://www.chartjs.org/img/chartjs-logo.svgf") no-repeat fixed center'
            }
            
        ]
    }
    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Doughnut Chart',
                color:'blue',
                font: {
                    size:24
                },
                padding:{
                    top:20,
                    bottom:20
                },
                responsive:true,
                maintainAspectRatio:false,
                animation:{
                    animateScale: true,
                    color: true            }
            }
        }
        
    }
    const plugins = [{
        beforeDraw: function(chart) {
         var width = chart.width,
             height = chart.height,
             ctx = chart.ctx;
             ctx.restore();
             var fontSize = (height / 200).toFixed(2);
             ctx.font = fontSize + "em sans-serif";
             ctx.textBaseline = "middle";
            //  ctx.textColor = "red";
             var text = `${recipeCalories} KCal`,
             textX = Math.round((width - ctx.measureText(text).width) / 2),
             textY = height / 2;
             ctx.fillStyle = 'rgba(205, 180, 0, 1)';
             ctx.fillText(text, textX, textY);
             ctx.save();
        } 
      }]

    return(
             <Doughnut data={data} options={options} plugins={plugins}  />      
    )
}

export default DoughChart;