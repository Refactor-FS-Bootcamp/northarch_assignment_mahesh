import React, { useState } from "react";  
import { read, utils, writeFile } from 'xlsx';
import './ExcelData.css'

const ExcelData = () => {
    const [movies, setMovies] = useState([
       
    ]);
    
  
    
    // const handleClickEditRow = (rowIndex) => {
    //     setTableData(prev => prev.map((r, index) => ({...r, isEditing: rowIndex === index})))
    // }

   

    const handleImport = (event) => {
        const files = event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;

                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    setMovies(rows)
                }
            }
            reader.readAsArrayBuffer(file);
        }
     }

    const handleExport = () => {
        const headings = [[
            'Movie',
            'Category',
            'Director',
            'Rating'
        ]];
        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, movies, { origin: 'A2', skipHeader: true });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Movie Report.xlsx');
    }

    const removeElement = (index) => {
        const series = movies.filter((_, i) => i !== index);
        setMovies(series);
      };

        
    const editElement=(index)=>{
        const series = movies.filter((_, i) => i !== index);
        setMovies(series);
        
    }
    

    return (
        <>
            <div className="row mb-2 mt-5">
                <div className="col-sm-6 offset-3">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="input-group">
                                <div className="custom-file">
                                    <input type="file" name="file" className="custom-file-input" id="inputGroupFile" required onChange={handleImport}
                                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                                    <label className="custom-file-label" htmlFor="inputGroupFile"></label>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="main">Export the File</label>
                            <button onClick={handleExport} className="btn btn-primary float-right">
                                Export <i className="fa fa-download"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6 offset-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">WebSeries</th>
                                <th scope="col">Category</th>
                                <th scope="col">Actor</th>
                                <th scope="col">IMDb Rating</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody> 
                                {
                                    movies.length
                                    ?
                                    movies.map((movie, index) => (
                                        <tr key={index}>
                                            <th scope="row">{ index + 1 }</th>
                                            <td>{ movie.Movie }</td>
                                            <td>{ movie.Category }</td>
                                            <td>{ movie.Director }</td>
                                            <td><span className="badge bg-warning text-dark">{ movie.Rating }</span></td>
                                            <button onClick={() => removeElement(index)}>remove</button>
                                            <button onClick={()=>editElement(index)}>Edit</button>
                                        </tr> 
                                    ))
                                    :
                                    <tr>
                                        <td colSpan="5" className="text-center">No Movies Found.</td>
                                    </tr> 
                                }
                        </tbody>
                    </table>
                </div>
            </div>
        </>

    );
};

export default  ExcelData;
