import logo from './logo.svg';
import './App.css';
import './main.css'

function App() {
  return (
    <div>
      <head>
        <meta charset="UTF-8" />
        <title>Base representada</title>
      </head>
      <header>
        <div className="grid base">
          <div className="ghti" id="headline">
              Titulo
              <div className="rhyr">Año de Estreno</div>
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
          <div className="gr1f">Director:<br /><span id="dir" className='defaultBlue'/>Placeholder</div>
          <div className="gr2f">Distribuidora:<br /><span id="dis" className='defaultBlue' />Placeholder</div>
          <div className="gr3l">cantidad<br />Temporadas</div>
          <div className="gr3r"><span id="vis" className='defaultBlue'/>Serie vista el:<br />00/00/0000</div>
        </div>
      </header>
    </div>
  )
}
export default App;
