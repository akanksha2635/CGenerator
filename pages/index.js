import Head from "next/head";
import React,{ useState } from "react";
import styles from "./index.module.css";
import Caption from "react-caption";
import quotes from "./quotes.json";

export default function Home() {
  const [moodInput, setMoodInput] = useState("");
  const [lengthInput, setLengthInput] = useState("");
  const [numberInput, setNumberInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState("");
  const [result, setResult] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setResult([]);
      setLoading(true);
      generateRandomQuote();
      let prompt ="";
      if(imageUrl.length!=0)
      {
        prompt = `Generate ${numberInput} social media ${lengthInput} captions with multiple hashtags and emojis based on this image ${imageUrl} and mood ${moodInput} `;
      }
      
      
      console.log("prompt - "+prompt);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ CaptionPrompt: prompt }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      const captions = data.result.split('\n');
      captions.map(point => point.trim());
      console.log("captions - "+captions);
      setLoading(false);
      setResult(captions);
      setMoodInput("");
      setLengthInput("");
      setNumberInput("");
      setImageUrl("");
      setQuote("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const FileInput = ({ setImageUrl }) => {
    const handleChange = (e) => {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    };
    return <input type="file" placeholder="Upload an image" onChange={handleChange} />;
  };

  const generateRandomQuote = () => {
    // Get a random quote from the database
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  };

  return (
    <div>
      <Head>
        <title>Generate Caption</title>
        <link rel="icon" href="/caption.png" />
      </Head>

      <main className={styles.main}>
        <img src="/caption.png" className={styles.icon} />
        <h3>Generate captions for an image</h3>
        <form onSubmit={onSubmit}>
         <FileInput setImageUrl={setImageUrl} />
          {imageUrl && <img src={imageUrl} alt="Preview" />}
          <select type="mood" value={moodInput} onChange={(e) => setMoodInput(e.target.value)}>
              <option value="" disabled>
                Select Your Mood
              </option>
              <option value="happy">Happy</option>
              <option value="sad">Sad</option>
              <option value="funny">Funny</option>
              <option value="inspirational">Inspirational</option>
           </select>
           <select type="length" value={lengthInput} onChange={(e) => setLengthInput(e.target.value)}>
              <option value="" disabled>
                Select Input Length
              </option>
              <option value="just emojis">Just Emojis</option>
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
           </select>
          
          <input
            type="number"
            name="number"
            placeholder="Enter the number of caption"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
          />
          <input type="submit" value="Generate captions" />
        </form>
        {loading ? (
        <div>
          <img src="loading.gif" alt="Loading" width={150}/>
          <p>{quote.text}</p>
          <p><b>{quote.author}</b></p>
        </div>
      ) :
        (<div className={styles.result}>
          <ul className={styles.ul}>
          {result.map((point,index) => (
            <li key ={index}>{point}</li>
          ))} 
          </ul>
        </div>)}
      </main>
    </div>
  );
}

