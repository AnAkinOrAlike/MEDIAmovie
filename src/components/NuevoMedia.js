import '../main.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { LibraryAdd, DarkMode, Visibility } from '@nine-thirty-five/material-symbols-react/sharp';
import { supabase } from '../supabase.js';

export default function NuevoMedia(){
const navigate = useNavigate();
const [theme, setTheme] = useState('light');

const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
        document.body.className = theme;
    };

useEffect(() => {
        document.body.className = theme;
    }, [theme]);

const [nombre, setNombre] = useState('')
const [year, setYear] = useState('')
const [duracion, setDuracion] = useState('')
const [imagen, setImagen] = useState('')
const [previewUrl, setPreviewUrl] = useState(null)
const [colorhex, setColorhex] = useState('')
const [director, setDirector] = useState('')
const [compania, setCompania] = useState('')
const [categorias, setCategorias] = useState([])
const [categoriaId, setCategoriaId] = useState(null);
const [country, setCountry] = useState('')
const [visto, setVisto] = useState(0)
const [ultimoVisto, setUltimoVisto] = useState("");
const [avance, setAvance] = useState(0);
const [stars, setStars] = useState(0);

async function getOrCreateId(table, column, value) {
    if (!value) return null;

    const { data, error } = await supabase
        .from(table)
        .select("id")
        .eq(column, value)
        .single();

    if (error && error.code !== "PGRST116") { // PGRST116 = no rows found
        console.error(error);
        throw error;
    }

    if (data) {
        return data.id;
    }

    const { data: inserted, error: insertError } = await supabase
        .from(table)
        .insert([{ [column]: value }])
        .select("id")
        .single();

    if (insertError) {
        console.error(insertError);
        throw insertError;
    }

    return inserted.id;
}

async function handleSubmit(e) {
    e.preventDefault();

    let filePath = null
    if (imagen) {
      const fileExt = imagen.name.split(".").pop()
      const fileName = `${nombre}-${Date.now()}.${fileExt}`
      filePath = `Imagenes/${fileName}`

      const { error } = await supabase.storage
        .from("Imagenes")
        .upload(filePath, imagen)

      if (error) {
        console.error(error)
        return
      }
    }

    try {
        const directorId = await getOrCreateId("DIRECTORES", "artist", director);
        const companiaId = await getOrCreateId("COMPAÑIA", "hogar", compania);
        const countryId = await getOrCreateId("COUNTRY", "country", country);

        const newMedia = {
            nombre,
            year,
            duracion,
            imagen: filePath,
            colorhex,
            id_director: directorId,
            id_compania: companiaId,
            id_country: countryId,
            id_categoria: categoriaId,
            visto,
        };

    const { data, error } = await supabase
        .from("MEDIA")
        .insert([newMedia])
        .select("id")
        .single();

    if (error) throw error;

    if (visto) {
        const { error: vistosError } = await supabase
            .from("VISTOS")
            .insert([{
            id_media: data.id,
            ultimo_visto: ultimoVisto,
            stars,
            created_at: new Date().toISOString(),
            }]);
        if (vistosError) throw vistosError;
    } else {
        const { error: marchaError } = await supabase
            .from("MARCHA")
            .insert([{
            id_media: data.id,
            ultimo_visto: ultimoVisto,
            avance,
            created_at: new Date().toISOString(),
            }]);
        if (marchaError) throw marchaError;
    }

        alert("Registro insertado correctamente");
        navigate("/");
    } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
    }
}

function handleFileChange(event) {
    if (!event.target.files || event.target.files.length === 0) return
    const file = event.target.files[0]
    setImagen(file)
    setPreviewUrl(URL.createObjectURL(file))
}

useEffect(() => {
  async function fetchCategorias() {
    const { data, error } = await supabase
      .from("CATEGORIA")
      .select("id, categoria");

    if (error) {
      console.error(error);
    } else {
      setCategorias(data);
    }
  }

  fetchCategorias();
}, []);

return(
    <>
    <header className='HeaderForm'>
        <div className="HeaderWelcome"> ¡BIENVENIDO A MI PROGRAMA!</div>
        <button className="HeaderButtons popGlow" onClick={() => navigate("/")}> <Visibility height={40} width={40}/> </button>
        <button className="HeaderButtons popGlow active"> <LibraryAdd height={40} width={40}/></button>
        <button className={`HeaderButtons popGlow ${theme === "dark" ? "active" : ""}`} onClick={toggleTheme}> <DarkMode height={40} width={40}/></button>
        <div className="HeaderLabels"> Lista para Ver</div>
        <div className="HeaderLabels"> Añadir Nuevo</div>
        <div className="HeaderLabels"> Modo Oscuro</div>
    </header>
    <main>
        <span className="divider">Registros</span>
        <form className="formTable" onSubmit={handleSubmit}>
            <div className='fgty'>
                <label htmlFor='Titulo' className='fltx'> 
                    Titulo
                </label>    
                <label htmlFor='Year' className='fltx'>
                    Año
                </label>
                <input type="text" 
                    id="Titulo" 
                    className='fcit'
                    value={nombre|| ''}
                    required
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder=' _ _ _ _ |'
                />
                <input type="number" 
                    id="Year" 
                    className='fcit'
                    value={year|| ''}
                    required
                    onChange={(e) => setYear(e.target.value)}
                    placeholder=' _ _ _ _ |'
                />
            </div>
            <div className='fgff'>
                <label htmlFor='Categoria' className='fltx'>
                    Categoria
                </label>
                <label htmlFor='Duración' className='fltx'>
                    Duración
                </label>
                <select
                    value={categoriaId || ""}
                    required
                    id='Categoria'
                    className='fbit'
                    onChange={(e) => setCategoriaId(e.target.value)}>
                    <option value=""> seleccionar </option>
                    {categorias.map((cat) => (<option key={cat.id} value={cat.id}>{cat.categoria}</option>))}
                </select>
                <input type="text" 
                    id="Duración" 
                    className='fbit'
                    value={duracion|| ''}
                    required
                    onChange={(e) => setDuracion(e.target.value)}
                    placeholder=' _ _ _ _ |'
                />
            </div>

            <div className="formImage">
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="fbim" />
                ) : (
                    <div className="fbim" />
                )}
                <label htmlFor="single" className="fbst">
                    Imagen
                </label>
                <input
                    style={{ visibility: "hidden", position: "absolute" }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
            <input type="color" 
                id="ColorHex" 
                value={colorhex|| ''}
                required
                onChange={(e) => setColorhex(e.target.value)}
            />
            <label htmlFor='Director'>
                Director
            </label>
            <input type="text" 
                id="Director" 
                className='fbit'
                value={director|| ''}
                required
                onChange={(e) => setDirector(e.target.value)}
                placeholder=' _ _ _ _ |'
            />
            <label htmlFor='Distribuidora'>
                Distribuidora
            </label>
            <input type="text" 
                id="Distribuidora" 
                className='fbit'
                value={compania|| ''}
                required
                onChange={(e) => setCompania(e.target.value)}
                placeholder=' _ _ _ _ |'
            />
            
            
            <label htmlFor='Pais'>
                País
            </label>
            <input type="text" 
                id="Pais" 
                className='fbit'
                value={country|| ''}
                required
                onChange={(e) => setCountry(e.target.value)}
                placeholder=' _ _ _ _ |'
            />
            <label>
                ¿Visto?
                <input
                    type="checkbox"
                    checked={visto}
                    onChange={(e) => setVisto(e.target.checked)}
                />
            </label>
            <label htmlFor='Ultimovisto'>
                Último visto
            </label>
            <input
                type="date"
                id="Ultimovisto"
                className='fbit'
                value={ultimoVisto || ""}
                onChange={(e) => setUltimoVisto(e.target.value)}
            />
            {visto ? (
                <label>
                    Stars: {stars}
                    <input
                    type="range"
                    min="1"
                    max="5"
                    value={stars}
                    onChange={(e) => setStars(Number(e.target.value))}
                    />
                </label>
            ) : (
                <label>
                    Avance: {avance}%
                    <input
                    type="range"
                    min="1"
                    max="100"
                    value={avance}
                    onChange={(e) => setAvance(Number(e.target.value))}
                    />
                </label>
            )}
            <button type="submit">Guardar</button>
        </form>
    </main>
    </>
);
}