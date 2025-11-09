import React from "react";
import logo from '../logo.svg';
import '../main.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { supabase } from '../supabase.js';
import { LibraryAdd, DarkMode, Visibility, Planet, MotionPlay } from '@nine-thirty-five/material-symbols-react/sharp';
import { BookmarkHeart } from "@nine-thirty-five/material-symbols-react/sharp/filled";

export default function ListaParaVer() {
    const [media, setMedia] = useState([]);
    const [theme, setTheme] = useState('light');
    const navigate = useNavigate();
    const main_limite = 10;

    const fetchData = async () => {
        const { data: vistos, error: errorVistos } = await supabase
        .from("mediavistos")
        .select("*");

        const { data: marcha, error: errorMarcha } = await supabase
        .from("mediamarcha")
        .select("*");

        if (errorVistos) throw errorVistos;
        if (errorMarcha) throw errorMarcha;

        const combined = [...(vistos || []), ...(marcha || [])];

        combined.forEach(item => {
            const { data } = supabase.storage.from("Imagenes").getPublicUrl(item.imagen);
            item.imagen = data.publicUrl;
        });

       console.log(combined)

        function shuffle(arr) {
        return arr
            .map((item) => ({ sort: Math.random(), value: item }))
            .sort((a, b) => a.sort - b.sort)
            .map((obj) => obj.value);
        }

        const randomized = shuffle(combined);
        console.log(randomized);
        setMedia(randomized);
    };

    function GridItem({ media }) {
        const mainColor = media?.colorhex || "#6495ed";
        const rating = media?.stars || 0;

        return (
        <div className="gridvisto" style={{ "--main-color": mainColor }}>
            <div className="ghti" id="headline" style={{ backgroundColor: mainColor }}> {media?.nombre || "..."}
            <div className="rhyr">                                                      <Planet height={20} width={20} viewBox="0 -1100 900 900" className="over"/>
                                                                                        {media?.year || "..."}{" "}
                                                                                        <MotionPlay height={20} width={20} viewBox="0 -1100 900 900" className="over"/>
                                                                                        {media?.duracion || "..."}{" "}{media?.typedur || "..."}
            </div></div>

            <div className="ghbs" style={{ backgroundColor: mainColor }}>              <GridHeaderBoxSmall media={media} rating={rating} mainColor={mainColor} />
            </div>

            <div className="gbim">                                                      <img className="bima popGlow" src={media?.imagen || logo} alt="logo" />
            </div>

            <div className="gr1f">                                                      Director:
            <br /><span className="bwbk">                                          {media?.director || "..."}
            </span></div>

            <div className="gr2f">                                                      Distribuidora:
            <br /><span className="bwbk">                                          {media?.compania || "..."}
            </span></div>

            <div className="gr3f">                                                      País:
            <br /> <span className="bwbk">                                          {media?.country || "..."}
            </span></div>
        </div>
        );
    }

    function GridHeaderBoxSmall({ media, rating, mainColor }) {
        if (media?.stars) {
            return (
            <>                                                        {media?.categoria || "..."} {media?.catvisto || "..."}
            <br /><span className="bwbk">                             {media?.ultimo_visto || "00/00/0000"}
            </span>                                                   <StarRating rating={rating} mainColor={mainColor} />
            </>
            );
        } else if (media?.avance && media.avance !== 0) {
            return (
            <>                                                        {media?.categoria || "..."} {media?.catvisto || "..."}
            <br /><span className="bwbk">                                {media?.ultimo_visto || "00/00/0000"}
            </span>                                                   <ProgressBar value={media.avance} mainColor={mainColor} />
            </>
            );
        } else {
            return (
            <>                                                           Actualizar Serie:
            <br />
            <div className="bstr popGlow" style={{ "--letterSpa": "normal" }}><BookmarkHeart height={30} width={30} />
            </div></>
            );
        }
    }


    function StarRating({ rating, mainColor }) {
        return (
        <div className="bstr popGlow" style={{ "--letterSpa": "3px" }}>
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

    function ProgressBar({ value }) {
        const progress = Math.max(0, Math.min(100, value));
        const totalBlocks = 8;
        const filledBlocks = Math.round((progress / 100) * totalBlocks);
        const bar = Array.from({ length: totalBlocks }, (_, i) =>
        i < filledBlocks ? "■" : "□"
    );
        return (
        <div className="bstr popGlow" style={{ "--letterSpa": "-2px" }}>
            {bar}<span >{progress}%</span>
        </div>
        );
    }

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
        document.body.className = theme;
    };

    useEffect(() => {
        fetchData();
    }, []); 

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (
    <>
    <header className='HeaderLista'>
        <div className="HeaderWelcome"> ¡BIENVENIDO A MI PROGRAMA!</div>
        <button className="HeaderButtons popGlow active"> <Visibility height={40} width={40}/> </button>
        <button className="HeaderButtons popGlow" onClick={() => navigate("/nuevo")}> <LibraryAdd height={40} width={40}/></button>
        <button className={`HeaderButtons popGlow ${theme === "dark" ? "active" : ""}`} onClick={toggleTheme}> <DarkMode height={40} width={40}/></button>
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