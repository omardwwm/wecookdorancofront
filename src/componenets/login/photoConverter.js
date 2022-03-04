import React, {useState, useEffect} from 'react';
import Tesseract from 'tesseract.js';
import axios from "axios";
// import { createWorker } from 'tesseract.js';

const ConvertImgToText = () =>{

    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState('');
    const [text, setText] = useState('');
    const [progress, setProgress] = useState(0);
    const[errorMsg, setErrorMsg] = useState('')
    // Pour tester l'api node tesseract
    const [picture, setPicture] = useState("");

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


      useEffect(() => {
        let mounted = true;
        if(mounted){
          console.log(picture)
        }
        return () => mounted = false
      }, [picture])

      const selectPict = (e)=>{
        e.preventDefault();
        setPicture(e.target.files[0]);
        console.log(picture);
      }
      const testApiTessNode = async(e)=>{

        e.preventDefault();
        const config = {headers: {
          Accept:'*/*',
          'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
      }};
      console.log(picture);
        const formData = new FormData();
        formData.append("picture",picture);
        await axios.post('http://localhost:8080/convert', formData, config);
        // .then(response=>{
        //     console.log(response && response.data);
        // })      
      }


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
                <form enctype="multipart/form-data">
                  <input
                    type="file"
                    name="picture"
                    onChange={selectPict}
                    // onChange={(e) =>
                    //   // setImage(URL.createObjectURL(e.target.files[0]))
                    //   setPicture(e.target.files[0])
                    // }
                    className="form-control mt-1 mb-1"
                  />
                  <input
                    type="button"
                    // onClick={convertImg}
                    onClick={testApiTessNode}
                    className="btn btn-primary mt-1"
                    value="Convert"
                  />
                </form>
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

// export default ConvertImgToText;