import './App.css'
import { useState } from 'react'
import { create } from 'ipfs-http-client'
import 'bootstrap/dist/css/bootstrap.css';

const client = create('https://ipfs.infura.io:5001/api/v0')

let addedFiles = [];

function App() {
  const [fileUrl, updateFileUrl] = useState(``)
  async function onChange(e) {
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
  console.log(addedFiles)
  return (
    <div className="container">
      <h1 className='mt-4'>File upload to IPFS</h1>
      <div>
          <label onChange={onChange} htmlFor="formId" className='uploadForm mt-4'>
              <input name="" type="file" id="formId"  hidden />
              Upload
          </label>
      </div>
      <div class>
        {
          fileUrl && (
            <img src={fileUrl} alt="uploadedIMG"/>
          )
        }
      </div>
    </div>
  );
}

export default App