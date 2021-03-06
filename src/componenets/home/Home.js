import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getProfessionnals } from "../../redux/actions/UserActions";
import { Link } from "react-router-dom";
import axios from "axios";
import { Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from 'reactstrap';
import "./home.css";


const Home = () => {

    const [lastRecipes, setLastRecipes] = useState([]);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    // const allProf = useSelector(state=>state.userReducer.professionnals)
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === lastRecipes.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }
    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? lastRecipes.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }
    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }
    const slides = lastRecipes && lastRecipes.map((item) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={item.recipePicture}
            >
                <img id="carouselImg"
                    // src={`https://mern-recipes.herokuapp.com${item.recipePicture}`}
                    src={item.recipePicture}
                    alt={item.recipeName}
                />
                <Link to={{ pathname: `/recipesDetails/${item._id}`, state: { item } }}>
                    <CarouselCaption className="d-block" captionText={item.recipeName} captionHeader={item.recipeName} />
                </Link>
            </CarouselItem>
        );
    });

    // const fetchLastRecipes =async()=>{
    //     await axios.get('https://mern-recipes.herokuapp.com/recipes/lastRecipes').then(response=>{
    //         console.log(response.data);
    //         setLastRecipes([...lastRecipes, ...response.data])
    //     })      
    // } 

    // console.log(lastRecipes);
    // console.log(allProf); 
    useEffect(() => {
        let mounted = true;
        setLoading(true);
        const fetchLastRecipes = async () => {
            await axios.get('https://mern-recipes.herokuapp.com/recipes/lastRecipes').then(response => {
                // console.log(response.data);
                if (mounted) {
                    setLastRecipes([...lastRecipes, ...response.data]);
                    dispatch(getProfessionnals());
                    setLoading(false);
                }
            }).catch(err => {
                console.log(err);
                setLoading(false);
            })
        }
        fetchLastRecipes();
        // if(mounted){
        //     fetchLastRecipes();

        // }
        return () => mounted = false;
    }, [])

    return (
        <div className="homePage col ">
            {lastRecipes && !loading ? (
                 <Carousel className="homeCarousel mt-2"
                 activeIndex={activeIndex}
                 next={next}
                 previous={previous}
             >
                 <CarouselIndicators items={lastRecipes} activeIndex={activeIndex} onClickHandler={goToIndex} />
                 {slides}
                 <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
                 <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
             </Carousel>
            ):
                (<div className='loader'>Loading...</div>)

            }

           
            <div className="presentationPerso">
                <p>
                    Ce site a ??t?? realis?? dans le but d'apprendre de nouvelles technologies (MERN). La partie frontend est r??alis?? avec ReactJs et Redux et elle est d??ploy??e sur NETLIFY, la partie backend avec NodeJs en utilisant Express et d??ploy??e sur HEROKU, concernant la base donn??es c'est de NOSQL en MongoDB et stock??e sur MongoDB Atlas (qui donne 500 M de stockage gratuites) avec le stockage des images gr??ce au service AWS S3.<br />Tous les services de d??ploiment et de stockage sont fournis par les diff??rentes plateformes gratuitement.<br />
                    Le site permet de:<br />
                </p>
                <ul>
                    <li>
                        Cr??er un compte, se connecter, d??connecter, modifier certaines informtions (utilisation du JWT pour s??curiser l'authentification et les requ??tes vers l'API (backend)) et de supprimer son compte.
                    </li>
                    <li>
                        Une fois le compte cr??e, vous pouvez rajouter des informations compl??mentaires comme une pr??sentation personnelle, citer ses influences culinaire et sp??cialit??s et ajouter un ??tablissemsnt o?? on peut trouver ses r??alisations (son restaurant par exemple)
                    </li>
                    <li>
                        Cr??er sa propre recette via un formulaire et un ??diteur de texte integr?? (WYSIWYG) pour les ??tapes et les instructions de chaque recette, on peut ??galement modifier tous les champs de la recette qu'on a edit?? via un formulaire pr??-rempli avec aussi un aper??u de l'image actuelle de la recette, il permet aussi de supprimer la recette. (ces fonctionalit??es sont possibles seulement si on a un compte et qu'on est connect??).
                    </li>
                    <li>
                        Poster des commentaires pour toutes les recettes et de supprimer ces commentaires aussi (on peut lire les commentaires sans obligation de cr??er un compte par contre pour poster un commentaire faut avoir un compte et ??tre connect??).
                    </li>
                    <li>
                        Possibilit?? de mettre des Likes ?? des recettes.
                    </li>
                </ul>
                <p>
                    D'autres am??liorations et fonctionalit??es seront ajout??es.
                </p>
            </div>
        </div>
    )
}

export default Home;