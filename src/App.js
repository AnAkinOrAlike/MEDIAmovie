import logo from './logo.svg';
import './App.css';
import './main.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabase.js';

console.log(process.env.REACT_APP_SUPABASE_URL);
console.log(process.env.REACT_APP_SUPABASE_ANON_KEY);

function App() {
  const [media, setMedia] = useState([]);

  const fetchData = async () => {
  const { data, error } = await supabase
    .from("MEDIA")
    .select(`
      id,
      nombre, 
      year, 
      duracion, 
      imagen, 
      colorhex,
      visto,
      categoria:CATEGORIA ( duracion, categoria ), 
      artist:DIRECTORES ( artist ), 
      hogar:COMPAÑIA ( hogar )
    `);

  if (error) {
    console.error("Error fetching data:", error.message);
    return;
  }

  const procesadas = await Promise.all(
    data.map(async (m) => {
      let vistos = null;

      if (m.visto === false) {
        const { data: enMarcha } = await supabase
        .from("MARCHA")
        .select("*")
        .eq("id_media", m.id)
        .single();

        vistos = { tipo: "marcha", ...enMarcha }; 

      } else {
        const { data: enVisto } = await supabase
        .from("VISTOS")
        .select("stars, ultimo_visto")
        .eq("id_media", m.id)
        .single();

        let fechaFormateada = null;

        if (enVisto?.ultimo_visto) {
          const d = new Date(enVisto.ultimo_visto);
          const dia = String(d.getDate()).padStart(2, "0");
          const mes = String(d.getMonth() + 1).padStart(2, "0");
          const año = d.getFullYear();
          fechaFormateada = `${dia}/${mes}/${año}`;
        }

        vistos = { tipo: "visto", ...enVisto, ultimo_visto: fechaFormateada };
      }

  return { ...m, vistos };}));
  setMedia(procesadas);
  console.log(procesadas);
  };

function GridItem({ media }) {
  const mainColor = media?.colorhex || "#6495ed";
  const rating = media?.vistos?.stars || 0;

  return (
    <div className="gridvisto">
      <div className="ghti" id="headline" style={{ backgroundColor: mainColor }}> {media?.nombre || "..."}
      <div className="rhyr">                                                      {media?.year || "..."}
      </div></div>

      <div className="ghbs" id="box" style={{ backgroundColor: mainColor }}>      <StarRating rating={rating} mainColor={mainColor} />
      </div>

      <div className="gbim">                                                      <img className="bima gl" src={media?.imagen} alt="logo" />
      </div>

      <div className="gr1f">                                                      Director:
      <br /><span id="dir" style={{ color: mainColor }}>                          {media?.artist?.artist || "..."}
      </span></div>

      <div className="gr2f">                                                      Distribuidora:
      <br /><span id="dis" style={{ color: mainColor }}>                          {media?.hogar?.hogar || "..."}
      </span></div>

      <div className="gr3l">                                                      Dura {media?.duracion || "..."}{" "}
      <span id="vis" style={{ color: mainColor }}>                                {media?.categoria?.duracion || "..."}
      </span></div>

      <div className="gr3r">
      <span id="vis" style={{ color: mainColor }}>                               {media?.categoria?.categoria || "..."} vista el:
      </span><br />                                                              {media?.vistos?.ultimo_visto || "00/00/0000"}
      </div>
    </div>
  );
}
const main_limite = 3;

function StarRating({ rating, mainColor }) {
  return (
    <div className="stfill star gl" id="star">
      {[1, 2, 3, 4, 5].map(num => (<>
        <input
          id={`radio${num}`} type="radio" name="estrellas" value={num} className="none" checked={rating === num} readOnly/>
        <label
          htmlFor={`radio${num}`}
          id={`star${num}`}
          style={{ color: num <= rating ? mainColor : "#000" }}>
          ★
        </label>
      </>))}
    </div>
  );
}

 useEffect(() => {
    fetchData();
  }, []); 

return (
  <>
  <head>
    <meta charSet="UTF-8" />
    <title>Base representada</title>
  </head>

  <header className='HeaderBack'>
    <div className="HeaderWelcome"> Bienvenido a mi programa</div>
    <div className="HeaderButtons"> Lista para Ver</div>
    <div className="HeaderButtons"> Añadir Nuevo</div>
    <div className="HeaderButtons"> Modo Día o Noche</div>
    <div className="HeaderLabels"> Lista para Ver</div>
    <div className="HeaderLabels"> Añadir Nuevo</div>
    <div className="HeaderLabels"> Modo Día o Noche</div>
  </header>

  <main>
    {media.slice(0, main_limite).map((media) => (
      <GridItem key={media.id} media={media} />
    ))}
  </main>
  </>
)
}
export default App;
