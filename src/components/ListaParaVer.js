import React from "react";
import logo from '../logo.svg';
import '../main.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { supabase } from '../supabase.js';
import { LibraryAdd, DarkMode, Visibility, Planet, MotionPlay } from '@nine-thirty-five/material-symbols-react/sharp';
import { BookmarkHeart } from "@nine-thirty-five/material-symbols-react/sharp/filled";
import FaultyTerminal from '../FaultyTerminal';

export default function ListaParaVer() {
    const [media, setMedia] = useState([]);
    const [theme, setTheme] = useState('light');
    const navigate = useNavigate();
    const main_limite = 50;

    const fetchData = async () => {
        const { data: vistos, error: errorVistos } = await supabase
        .from("mediavistos")
        .select("*");

        const { data: marcha, error: errorMarcha } = await supabase
        .from("mediamarcha")
        .select("*");

        if (errorVistos) throw errorVistos;
        if (errorMarcha) throw errorMarcha;

        const combined = [...(marcha || []), ...(vistos || [])];

        combined.forEach(item => {
            const { data } = supabase.storage.from("Imagenes").getPublicUrl(item.imagen);
            item.imagen = data.publicUrl;
        });

        function shuffle(arr) {
        return arr
            .map((item) => ({ sort: Math.random(), value: item }))
            .sort((a, b) => a.sort - b.sort)
            .map((obj) => obj.value);
        }

        const randomized = shuffle(combined);
        setMedia(randomized);
        setMedia(combined);
    };

    function GridItem({ media }) {
        const mainColor = media?.colorhex || "#6495ed";
        const rating = media?.stars || 0;
        const handleClick = () => {
            navigate("/nuevo", { state: { media } });
        };
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
            <br /><span className="bwbk">                                               {media?.director || "..."}
            </span></div>

            <div className="gr2f">                                                      Distribuidora:
            <br /><span className="bwbk">                                               {media?.compania || "..."}
            </span></div>

            <div className="gr3f">                                                      País:
            <br /> <span className="bwbk">                                              {media?.country || "..."}
            </span></div>
        </div>
        );

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
            <br /><span className="bwbk">                             {media?.ultimo_visto || "00/00/0000"}
            </span>                                                   <ProgressBar value={media.avance} mainColor={mainColor} />
            </>
            );
        } else {
            return (
            <>                                                                                      Actualizar Serie:<br />
            <div className="bstr popGlow" onClick={handleClick} style={{ "--letterSpa": "normal" }}><BookmarkHeart height={30} width={30} />
            </div></>
            );
        }
    }

    function StarRating({ rating, mainColor }) {
        return (
        <div className="bstr popGlow" onClick={handleClick} style={{ "--letterSpa": "3px" }}>
            {[1, 2, 3, 4, 5].map(num => (
            <label id={`star${num}`} key={num} style={{ color: num <= rating ? mainColor : "#000" }}>
            ★
            </label>))}
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
        <div className="bstr popGlow" onClick={handleClick} style={{ "--letterSpa": "-2px" }}>
            {bar}<span >{progress}%</span>
        </div>
        );
    }
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
    <div className="faulty-bg" aria-hidden="true">
        <div className="faulty-terminal-container">
            <FaultyTerminal
                scale={5}
                gridMul={[1, 3]}
                digitSize={1.2}
                timeScale={2}
                pause={false}
                scanlineIntensity={1}
                glitchAmount={1}
                flickerAmount={1}
                noiseAmp={1}
                chromaticAberration={1}
                dither={0.1}
                curvature={0.2}
                tint="#3078fc"
                mouseReact={false}
                mouseStrength={0}
                pageLoadAnimation={true}
                brightness={1}
            />
        </div>
    </div>
    <div className="pageContent">
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
            {media.slice(0, main_limite).map((item, index) => (
            <GridItem key={index} media={item} />
            ))}
            </div>
        </main>
        <footer style={{height: "100px"}}></footer>
      </div>
    </>
)
}