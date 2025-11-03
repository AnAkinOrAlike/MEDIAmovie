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
    const { data, error } = await supabase
      .from("MEDIA")
      .select("nombre, year, duracion, categoria:CATEGORIA ( duracion )")
      .eq("id", 2)
      .single();

    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      setMedia(data);
      console.log(data);
    }
  }; 

 useEffect(() => {
    fetchData();
  }, []); 

  return (
    <>
      <head>
        <meta charset="UTF-8" />
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
      <content>
        <div className="grid base">
          <div className="ghti" id="headline">
            {media ? media.nombre : "Cargando..."}
          <div className="rhyr">
            {media ? media.year : "Cargando..."}
          </div>
          </div>
          <div className="ghbs" id="box">
              <div className="stfill star gl" id="star">
                  <input id="radio1" type="radio" name="estrellas" value="1" className="none"></input>
                      <label for="radio1" id="star1">★</label>
                  <input id="radio2" type="radio" name="estrellas" value="2" className="none"></input>
                      <label for="radio2" id="star2">★</label>
                  <input id="radio3" type="radio" name="estrellas" value="3" className="none"></input>
                      <label for="radio3" id="star3">★</label>
                  <input id="radio4" type="radio" name="estrellas" value="4" className="none"></input>
                      <label for="radio4" id="star4">★</label>
                  <input id="radio5" type="radio" name="estrellas" value="5" className="none"></input>
                      <label for="radio5" id="star5">★</label>
              </div>
          </div>
          <div className="gbim"><img className="bima gl"src={logo} alt="logo" /></div>
          <div className="gr1f">Director:<br /><span id="dir" className='defaultBlue'>Placeholder</span></div>
          <div className="gr2f">Distribuidora:<br /><span id="dis" className='defaultBlue'>Placeholder</span></div>
          <div className="gr3l">
            {media ? media.duracion : "Cargando..."}{" "}
          <span id="vis" className='defaultBlue'>
            {media ? media.categoria.duracion : "Cargando..."}
          </span></div>
          <div className="gr3r"><span id="vis" className='defaultBlue'>Serie vista el:</span><br />00/00/0000</div>
        </div>
      </content>
    </>
  )
}
export default App;
