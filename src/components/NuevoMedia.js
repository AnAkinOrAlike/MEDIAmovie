import '../main.css';
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import { LibraryAdd, DarkMode, Visibility, Image, Palette, CardsStar, DashboardCustomize, Save, Delete } from '@nine-thirty-five/material-symbols-react/sharp';
import { supabase } from '../supabase.js';
import React from 'react';

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

  const { state } = useLocation();
  const media = state?.media;

const [nombre, setNombre] = useState('')
const [year, setYear] = useState('')
const [duracion, setDuracion] = useState('')
const [imagen, setImagen] = useState('')
const [previewUrl, setPreviewUrl] = useState(null)
const [colorhex, setColorhex] = useState('#6495ed')
const [director, setDirector] = useState('')
const [compania, setCompania] = useState('')
const [categorias, setCategorias] = useState([])
const [categoriaId, setCategoriaId] = useState(null);
const [country, setCountry] = useState('')
const [visto, setVisto] = useState(0)
const [ultimoVisto, setUltimoVisto] = useState("");
const [avance, setAvance] = useState(0);
const [stars, setStars] = useState(0);


  useEffect(() => {
  if (!media) return;

  if (media.nombre) setNombre(media.nombre);
  if (media.year) setYear(media.year);
  if (media.duracion) setDuracion(media.duracion);
  if (media.imagen) {
    setImagen(media.imagen);
    setPreviewUrl(media.imagen);
  }
  if (media.colorhex) setColorhex(media.colorhex);
  if (media.director) setDirector(media.director);
  if (media.compania) setCompania(media.compania);
  if (media.country) setCountry(media.country);
  if (media.ultimo_visto) setUltimoVisto(media.ultimo_visto);
  if (media.avance !== undefined) setAvance(media.avance);
  if (media.stars !== undefined) setStars(media.stars);

  if (media.stars !== undefined) {
    setVisto(1);
  } else {
    setVisto(0);
  }

  if (media.categoria && categorias.length > 0) {
    const match = categorias.find(cat => cat.categoria === media.categoria);
    if (match) setCategoriaId(match.id);
  }
}, [media, categorias]);


function StarInput({ rating, onChange}) {
    return (
        <div className="star fcit popGlow">
            {[5, 4, 3, 2, 1].map(num => (
                <React.Fragment key={num}>
                <input
                    id={`radiostar${num}`}
                    type="radio"
                    name="stellas"
                    value={num}
                    className="none"
                    checked={rating === num}
                    onChange={() => onChange(num)}
                />
                <label htmlFor={`radiostar${num}`} className={`star-label ${num <= rating ? "active" : ""}`}>★
                </label>
                </React.Fragment>
            ))}
        </div>
    )
}

function ProgressRadio({ value, onChange }) {
  return (
    <div className="cube fcit popGlow">
        {[...Array(8)].map((_, i) => {
            const blockValue = 100 - i * 12.5;
            return (
            <React.Fragment key={i}>
                <input
                type="radio"
                id={`cube${i}`}
                name="progress"
                value={blockValue}
                className="none"
                checked={value === blockValue}
                onChange={() => onChange(blockValue)}
                />
                <label htmlFor={`cube${i}`} className={value >= blockValue ? "active" : ""}>■
                </label>
            </React.Fragment>
            );
        })}
    </div>
  );
}

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
    try {
        const directorId = await getOrCreateId("DIRECTORES", "artist", director);
        const companiaId = await getOrCreateId("COMPAÑIA", "hogar", compania);
        const countryId = await getOrCreateId("COUNTRY", "country", country);
        let filePath = null;

        const { data: existingMedia, error: fetchError } = await supabase
            .from("MEDIA")
            .select("id, imagen")
            .eq("nombre", nombre)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

        let mediaId;

        if (imagen instanceof File) {
        const firstWord = (nombre || "").trim().split(/\s+/)[0] || "file";

        const safeWord = firstWord.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase();

        const fileExt = imagen.name.split(".").pop();
        const newFileName = `${safeWord}-${Date.now()}.${fileExt}`;
        const filePath = `Imagenes/${newFileName}`;

        const existingFileName = existingMedia?.imagen?.split("/").pop();

        if (existingFileName && existingFileName !== imagen.name) {
            const { error: deleteError } = await supabase.storage
            .from("Imagenes")
            .remove([existingMedia.imagen]);

            if (deleteError) {
            console.error("Error deleting previous image:", deleteError);
            return;
            }
        }

        const { error: uploadError } = await supabase.storage
            .from("Imagenes")
            .upload(filePath, imagen);

        if (uploadError) {
            console.error("Error uploading new image:", uploadError);
            return;
        }
        } else if (typeof imagen === "string") {
            if (imagen.includes("/storage/v1/object/public/")) {
                const parts = imagen.split("/storage/v1/object/public/Imagenes/");
                filePath = parts[1];
            } else {
                filePath = imagen;
            }
        }


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

        if (existingMedia) {
        const { error: updateError } = await supabase
            .from("MEDIA")
            .update(newMedia)
            .eq("id", existingMedia.id);

        if (updateError) throw updateError;
        mediaId = existingMedia.id;
        } else {
        const { data, error: insertError } = await supabase
            .from("MEDIA")
            .insert([newMedia])
            .select("id")
            .single();

        if (insertError) throw insertError;
        mediaId = data.id;
        } 

    await supabase
        .from("VISTOS")
        .delete()
        .eq("id_media", mediaId);

    await supabase
        .from("MARCHA")
        .delete()
        .eq("id_media", mediaId);

        
    if (visto) {
        await supabase
            .from("VISTOS")
            .insert([{
            id_media: mediaId,
            ultimo_visto: ultimoVisto,
            stars,
            created_at: new Date().toISOString(),
            }]);
        } else {
        await supabase
            .from("MARCHA")
            .insert([{
            id_media: mediaId,
            ultimo_visto: ultimoVisto,
            avance,
            created_at: new Date().toISOString(),
            }]);
        }

        alert(existingMedia ? "Registro actualizado correctamente" : "Registro insertado correctamente");
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

async function handleDelete(e){
    e?.preventDefault();

    const name = (nombre || "").trim();
    if (!name) {
        alert("There is no media to delete yet");
        return;
    }

    try {
        const { data, error: fetchError } = await supabase
        .from("MEDIA")
        .select("id, nombre")
        .eq("nombre", name)
        .single();

    if (fetchError) {
        console.error("Fetch error:", fetchError);
        alert("There is no media to delete yet");
        return;
    }
    
    if (!data) {
      alert("There is no media to delete yet");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${data.nombre}"? This cannot be undone.`)) {
      return;
    }


}catch (err) {
    console.error("Unexpected error:", err);
    alert("An unexpected error occurred. Check console.");
}}

useEffect(() => {
  async function fetchCategorias() {
    const { data, error } = await supabase
      .from("CATEGORIA")
      .select("id, categoria, duracion");

    if (error) {
      console.error(error);
    } else {
      setCategorias(data);
    }
  }

  fetchCategorias();
}, []);

const categoriaSeleccionada = categorias.find(cat => String(cat.id) === String(categoriaId));


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
                    className='fcit popGlow'
                    value={nombre|| ''}
                    required
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder=' _ _ _ _ |'
                />
                <input type="number" 
                    id="Year" 
                    className='fcit popGlow'
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
                    className='fbit popGlow'
                    onChange={(e) => setCategoriaId(e.target.value)}>
                    <option value=""> Seleccionar: </option>
                    {categorias.map((cat) => (<option key={cat.id} value={cat.id}>{cat.categoria}</option>))}
                </select>
                <div style={{ display: "flex"}}>
                <input
                    type="text"
                    id="Duración"
                    className="fbit fllw popGlow"
                    value={duracion || ''}
                    required
                    onChange={(e) => setDuracion(e.target.value)}
                    placeholder=' _ _ _ _ |'
                />
                    <span className="flrw fcit popGlow">
                        {categoriaSeleccionada?.duracion || ""}
                    </span>
                </div>
            </div>
            <div className="fgim center">
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="fbii" />
                ) : (
                    <div className="fbii colOne " />
                )}
                <label htmlFor="single" className="flib colOne popGlow">
                    <Image width={48} height={48} />
                </label>
                <input
                    className="nope"
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <div>
                <label htmlFor="ColorHex" className="flib colTwo popGlow">
                    <Palette width={48} height={48} />
                </label>
                <input type="color" 
                    id="ColorHex" 
                    className="fbci colTwo"
                    style={{ "--colorHex": colorhex }}
                    value={colorhex|| ''}
                    required
                    onChange={(e) => setColorhex(e.target.value)}
                />
            </div></div>
            <div className='fgft'>
            <label htmlFor='Director' className="fltx">
                            Director
            </label>
            <input type="text" 
                id="Director" 
                className='fbit popGlow'
                value={director|| ''}
                required
                onChange={(e) => setDirector(e.target.value)}
                placeholder=' _ _ _ _ |'
            />
            </div>
            <div className='fgft'>
                <label htmlFor='Distribuidora' className="fltx">
                    Distribuidora
                </label>
                <input type="text" 
                    id="Distribuidora" 
                    className='fbit popGlow'
                    value={compania|| ''}
                    required
                    onChange={(e) => setCompania(e.target.value)}
                    placeholder=' _ _ _ _ |'
                />
            </div>
            <div className='fgft'>
                <label htmlFor='Pais' className="fltx"> 
                    País
                </label>
                <input type="text" 
                    id="Pais" 
                    className='fbit popGlow'
                    value={country|| ''}
                    required
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder=' _ _ _ _ |'
                />
            </div>
            <div className='fgff'>
                <input type="radio" value={0} name="visto" className='none' id='marcha' onChange={(e) => setVisto(Number(e.target.value))}/>
                <input type="radio" value={1} name="visto" className='none' id='yavisto' onChange={(e) => setVisto(Number(e.target.value))}/>
                <label htmlFor='marcha' className={`pbrs popGlow ${visto === 0 ? "active" : ""}`}><CardsStar width={30} height={30}/>Para ver</label>
                <label htmlFor='yavisto' className={`pbrs popGlow ${visto === 1 ? "active" : ""}`}><DashboardCustomize width={30} height={30}/>Vistos</label>
            </div>
            <div className='fgff'>
            {visto ? (
                <React.Fragment>
                    <div className="fltx">Stars: {stars}</div>
                    <label htmlFor='Ultimovisto' className="fltx">Último visto</label>
                    <StarInput rating={stars} onChange={(n) => setStars(n)}/>
                    <input
                        type="date" 
                        id="Ultimovisto"
                        className='fbit popGlow'
                        value={ultimoVisto || ""}
                        onChange={(e) => setUltimoVisto(e.target.value)}
                    />
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <div className="fltx">Avance: {avance}%</div>
                    <label htmlFor='Ultimovisto' className="fltx">Último visto</label>
                    <ProgressRadio value={avance} onChange={(n) => setAvance(n)} />
                    <input
                        type="date" 
                        id="Ultimovisto"
                        className='fbit'
                        value={ultimoVisto || ""}
                        onChange={(e) => setUltimoVisto(e.target.value)}
                    />
                </React.Fragment>
            )}
            </div>
            <div className='fgff'>
                <button type="submit"  className='pbrs popGlow'><Save /></button>
                <button type="button" className='pbbd popGlow' aria-label="Delete item" onClick={handleDelete}><Delete /></button>
            </div>
        </form>
        <footer style={{height: "100px"}}></footer>
    </main>
    </>
);
}