import './App.css'
import { useState } from 'react'
import { create } from 'ipfs-http-client'

const client = create('https://ipfs.infura.io:5001/api/v0')

let addedFiles = [];

function App() {
  const [fileUrl, updateFileUrl] = useState(``)

  async function onChange(e) {
    console.log("ok")
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      addedFiles.push(added);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      updateFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  const listItems = addedFiles.map((addedFile =>
    <div className='fileshow-card-borderOn'>
      <img src={"https://ipfs.infura.io/ipfs/" + addedFile["path"]} alt="uploadedIMG"/>
    </div>)
  );

  return (
    <div className="container">
      <h1 className='header'>File upload to IPFS</h1>
      <div className='ipfsUploadsection'>
          <label onChange={onChange} htmlFor="formId" className='uploadForm'>
              <input name="" type="file" id="formId"  hidden />
              Upload 
          </label>
          <div className='imgUrl-show'>
            {fileUrl && (fileUrl)}
          </div>
      </div>
      <div className="fileshow-box">
        {
          fileUrl && (
            listItems
          )
        }
      </div>
    </div>
  );
}

export default App