import logo from './logo.svg';
import './App.css';
import './main.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabase.js';

console.log(process.env.REACT_APP_SUPABASE_URL);
console.log(process.env.REACT_APP_SUPABASE_ANON_KEY);

function App() {
  const [media, setMedia] = useState(null);

  const fetchData = async () => {
  const { data: media, error } = await supabase
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
    `)
    .eq("id", 4)
    .single();

  if (error) {
    console.error("Error fetching data:", error.message);
    return;
  }

  let vistos = null;

  if (media.visto === false) {

    const { data: enMarcha, error: marchaError } = await supabase
      .from("MARCHA")
      .select("*")
      .eq("id_media", media.id)
      .single();

    if (marchaError) console.error(marchaError);
    vistos = { tipo: "marcha", ...enMarcha };

  } else {

    const { data: enVisto, error: vistoError } = await supabase
      .from("VISTOS")
      .select("stars, ultimo_visto")
      .eq("id_media", media.id)
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

  const resultado = {
    ...media,
    vistos
  };

    setMedia(resultado);
    console.log(resultado);
  };  

const mainColor = media ? media.colorhex : "#6495ed";
const rating = media ? media.vistos.stars : 0;
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

  <header>
    <div className="BlueBack">
      Bienvenido a mi programa
    </div>
  </header>

  <nav className='GrayBack'>
    <div className="BlueBack"> Lista para Ver <br /></div>
    <div className="BlueBack"> Añadir Nuevo <br /></div>
    <div className="BlueBack"> Reload <br /></div>
    <div className="BlueBack"> Modo Día o Noche</div>
  </nav>

  <main>
    <div className="grid base">
      <div className="ghti" id="headline" style={{ backgroundColor: mainColor}}> {media ? media.nombre : "..."}
      <div className="rhyr">                                                     {media ? media.year   : "..."}
      </div></div>

      <div className="ghbs" id="box" style={{ backgroundColor: mainColor}}>     <StarRating rating={rating} mainColor={mainColor} />
      </div>

      <div className="gbim"><img className="bima gl" src={media ? media.imagen   : logo} alt="logo"/>
      </div>

      <div className="gr1f">                                      Director:
      <br /><span id="dir" style={{ color: mainColor}}>           {media ? media.artist.artist : "..."}
      </span></div>

      <div className="gr2f">                                     Distribuidora:
      <br /><span id="dis" style={{ color: mainColor}}>          {media ? media.hogar.hogar : "..."}
      </span></div>

      <div className="gr3l">                                     Dura {media ? media.duracion : "..."}{" "}
      <span id="vis" style={{ color: mainColor}}>                {media ? media.categoria.duracion : "..."}
      </span></div>

      <div className="gr3r">
      <span id="vis" style={{ color: mainColor}}>                {media ? media.categoria.categoria : "..."}{" "}vista el:
      </span><br />                                              {media ? media.vistos.ultimo_visto : "00/00/0000"}
      </div>
    </div>
  </main>
  </>
)
}
export default App;
