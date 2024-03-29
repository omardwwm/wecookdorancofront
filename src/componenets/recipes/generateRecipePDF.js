import React from 'react';
import jsPDF from 'jspdf';
import { renderToString } from "react-dom/server";
import ReactDOMServer from "react-dom/server";
import "./pdfStyle.css";
// import "./recipes.css";

export const generateRecipePDF = (recipeData, htmlInstructions) => {
    // console.log(recipeData);
    let { recipeIngrediants } = recipeData;
    // console.log(recipeIngrediants);
    const listIngrediants = () => {
        recipeIngrediants.map((ing, index) => {
            return (
                <ul className="ingr" key={index}>{ing.ingredientName}: {ing.quantity} {ing.ingredientUnity && ing.ingredientUnity} </ul>
            )
        })
    }

    const Prints = () => (
        <div>
            <h3>{recipeData.recipeName}</h3>
            <h4 className='testTitle'>Liste des ingredients</h4>
            {recipeIngrediants && recipeIngrediants.map((ing, index) => (
                <ul className="ingr" key={index}>{ing.ingredientName}: {ing.quantity} {ing.ingredientUnity && ing.ingredientUnity} </ul>
            ))}
            {/* <div className='ingrDiv'>
                {listIngrediants}
            </div> */}
            <h4 style={{ color: 'red' }}>Les instructions</h4>
            <div>
                <div dangerouslySetInnerHTML={{ __html: htmlInstructions }} />
            </div>
        </div>
    );
    const generatePDFInvoice = () => {
        const doc = new jsPDF("p", "pt", "a4");
        const stringHtmlToPrint = renderToString(<Prints />);
        // doc.text('testpdfsimple', 100, 100);
        // doc.save("TestPdf.pdf")
        // doc.html(stringHtmlToPrint, {
        //     callback: function (doc) {

        //         doc.save("TestPdf.pdf")
        //     }
        // });
        doc.fromHTML(stringHtmlToPrint, 20, 10, { height: 720, width:520 } );
        let pageCount = doc.internal.getNumberOfPages();
        // console.log(pageCount);
        let pageCurrentOut = doc.internal.getCurrentPageInfo().pageNumber; //Current Page
        // console.log(pageCurrentOut);
        // if (pageCurrentOut == 1) {
        //     pageCount = doc.internal.getNumberOfPages() - 1;
        //   }
        const remainingVSpace = doc.internal.pageSize.height;
        // console.log(remainingVSpace);

        // let pageCount = doc.internal.getNumberOfPages();
        // console.log(pageCount);
        const makePag = (pageCount) => {
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                // let splitTitle = doc.splitTextToSize(`${footer}`, 560);
                // doc.text(splitTitle, 16, 800, splitTitle, 'center');
                doc.text('WECOOK BY OMAR ', 16, 820)
                doc.setFontSize(10);
                doc.text('Page ' + String(i) + '/' + String(pageCount), 500, 820);
            }
        }

        // makePag(pageCount)
        if (remainingVSpace > 60 && pageCurrentOut == 1) {
            makePag(pageCount - 1)
            doc.deletePage(pageCount);

        } else {
            makePag(pageCount)
        }


        doc.save('recette.pdf');
    };
    generatePDFInvoice();
    // return (
    //     <div>
    //         <button onClick={generatePDFInvoice}>BTN FRON FILE generateRecipePDF</button>
    //     </div>
    // )
}
