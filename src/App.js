import React from "react";
import logo from './logo.svg';
import './App.css';
import './main.css';
import {Helmet} from "react-helmet";
import { useState, useEffect } from 'react';
import { supabase } from './supabase.js';
import { LibraryAdd, DarkMode, Visibility } from '@nine-thirty-five/material-symbols-react/sharp';

function App() {
  const [media, setMedia] = useState([]);
  const [theme, setTheme] = useState('dark');
  const main_limite = 10;

  const fetchData = async () => {
  const { data, error } = await supabase
    .from("mediavistos")
    .select(`*`);
  
  if (error) console.error(error);
  else console.log(data); 

  function shuffle(arr) {
    return arr
      .map((item) => ({ sort: Math.random(), value: item }))
      .sort((a, b) => a.sort - b.sort)
      .map((obj) => obj.value);
  }
  const randomized = shuffle(data);
  setMedia(randomized);
  console.log(randomized);
  };

  function GridItem({ media }) {
    const mainColor = media?.colorhex || "#6495ed";
    const rating = media?.stars || 0;

    return (
      <div className="gridvisto" style={{ "--main-color": mainColor }}>
        <div className="ghti" id="headline" style={{ backgroundColor: mainColor }}> {media?.nombre || "..."}
        <div className="rhyr">                                                      {media?.year || "..."}{" "}{media?.duracion || "..."}{" "}{media?.typedur || "..."}
        </div></div>

        <div className="ghbs" id="box" style={{ backgroundColor: mainColor }}>      <StarRating rating={rating} mainColor={mainColor} />
        </div>

        <div className="gbim">                                                      <img className="bima gl" src={media?.imagen || logo} alt="logo" />
        </div>

        <div className="gr1f">                                                      Director:
        <br /><span className="colorSpan">                                          {media?.director || "..."}
        </span></div>

        <div className="gr2f">                                                      Distribuidora:
        <br /><span className="colorSpan">                                          {media?.compania || "..."}
        </span></div>

        <div className="gr3l"></div>

        <div className="gr3r"><span className="colorSpan">                          {media?.categoria || "..."}{" "}{media?.catvisto || "..."} el {media?.ultimo_visto || "00/00/0000"}
        </span></div>
      </div>
    );
  }


  function StarRating({ rating, mainColor }) {
    return (
      <div className="bstr gl">
        {[1, 2, 3, 4, 5].map(num => (<React.Fragment key={num}>
          <input
            id={`radio${num}`} type="radio" value={num} className="none" checked={rating === num} readOnly/>
          <label
            htmlFor={`radio${num}`}
            id={`star${num}`}
            style={{ color: num <= rating ? mainColor : "#000" }}>
            ★
          </label>
        </React.Fragment>))}
      </div>
    );
  }

  useEffect(() => {
      fetchData();
    }, []); 
  
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    document.body.className = theme;
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

return (
  <>
  <Helmet>
    <meta charSet="UTF-8" />
    <title>Base representada</title>
  </Helmet>

  <header className='HeaderBack'>
    <div className="HeaderWelcome"> ¡BIENVENIDO A MI PROGRAMA!</div>
    <button className="HeaderButtons gl active"> <Visibility height={40} width={40}/> </button>
    <button className="HeaderButtons gl"> <LibraryAdd height={40} width={40}/></button>
    <button className={`HeaderButtons gl ${theme === "dark" ? "active" : ""}`} onClick={toggleTheme}> <DarkMode height={40} width={40}/></button>
    <div className="HeaderLabels"> Lista para Ver</div>
    <div className="HeaderLabels"> Añadir Nuevo</div>
    <div className="HeaderLabels"> Modo Oscuro</div>
  </header>
  <main>

    <span className="divider">Media</span>

    <div className='flexTable'>
    {media.slice(0, main_limite).map((media) => (
      <GridItem key={`${media.nombre}-${media.year}`} media={media} />
    ))}
    </div>
    
  </main>
  </>
)
}
export default App;
