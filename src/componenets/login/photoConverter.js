import React, {useState} from 'react';
import Tesseract from 'tesseract.js';
// import { createWorker } from 'tesseract.js';

const ConvertImgToText = () =>{

    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState('');
    const [text, setText] = useState('');
    const [progress, setProgress] = useState(0);
    const[errorMsg, setErrorMsg] = useState('')

    const convertImg = () => {
        if(!image){
            setErrorMsg('Image obligatoire');
            setTimeout(() => {
                setErrorMsg('');
            }, 4000);
        }else{
            setIsLoading(true);
            setErrorMsg('');
            // Tesseract.recognize(image, 'eng', {
                Tesseract.recognize(image, 'eng', {
              logger: (m) => {
                // console.log(m);
                if (m.status === 'recognizing text') {
                  setProgress(parseInt(m.progress * 100));
                }
              },
            })
              .catch((err) => {
                console.error(err);
              })
              .then((result) => {
                console.log(result && result.data);
                setText(result && result.data.text);
                setIsLoading(false);
                setErrorMsg('');
              });
        }
      };

      const cleanComponentConvert = event =>{
         event.preventDefault();
         setIsLoading(false);
         setImage('');
         setText('');
      }

      return (
        <div className="container">
          <div className="row h-100">
            <div className="col-md-8 mx-auto h-100 d-flex flex-column justify-content-center">
              {!isLoading && (
                <h1 className="text-center py-1 mc-1">Image To Text</h1>
              )}
              {isLoading && (
                <>
                  <progress className="form-control" value={progress} max="100">
                    {progress}%{' '}
                  </progress>{' '}
                  <p className="text-center py-0 my-0">Converting:- {progress} %</p>
                </>
              )}
              {!isLoading && !text && (
                <>
                  <input
                    type="file"
                    onChange={(e) =>
                      setImage(URL.createObjectURL(e.target.files[0]))
                    }
                    className="form-control mt-1 mb-1"
                  />
                  <input
                    type="button"
                    onClick={convertImg}
                    className="btn btn-primary mt-1"
                    value="Convert"
                  />
                </>
              )}
              <p style={{color:'#ff0000'}}>{errorMsg}</p>
              {!isLoading && text && (
                <>
                  <textarea
                    className="form-control w-200 mt-5"
                    rows="20"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  ></textarea>
                  <button onClick={cleanComponentConvert}>OK</button>
                </>
              )}
            </div>
          </div>
        </div>
      );


}

export default ConvertImgToText;