import {  useState} from 'react';
 import axios from 'axios';

 
 

const monthInWords=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function App() {
   const [Ten,setTen]=useState([]);
   const [transTable,setTransTable]=useState([]);
   const [page,setPage]=useState(0);
   const [pagination,setPagination]=useState("");
   const [search,setSearch]=useState(false);
   const [searchTable,setSearchTable]=useState([]);
   const [selectedMonth,setSelectedMonth]=useState("March");

    
 async function getTransactions(){
    let month=document.getElementById("select").value;
    
   let getDataByMonth=[];
    let totSales=0;
    let totSold=0;
    let leftover=0;
    let bars={"one":0,"two":0,"three":0,"four":0,"five":0,"six":0,"seven":0,"eight":0,"nine":0,"ten":0}
    
     const response=await axios.get(`https://roxilerback-end.onrender.com/getTransactions?month=${month}`);
     const data=response.data;
     const combined =await axios.get(`https://roxilerback-end.onrender.com/getCombinedData?month=${month}`);
      console.log(combined.data);
    for(let i in data){
           
       
               
              getDataByMonth.push(data[i]);
              
               if(data[i].sold){
                totSales+=data[i].price;
                totSold+=1;
               }
               else{
                leftover+=1;
               }
            if(data[i].price<=100){
                bars["one"]+=1;
            }
            else if(data[i].price>100 && data[i].price<=200){
                bars["two"]+=1;
            }
            else if(data[i].price>200 && data[i].price<=300){
                bars["three"]+=1;
            }
            else if(data[i].price>300 && data[i].price<=400){
                bars["four"]+=1;
            }
            else if(data[i].price>400 && data[i].price<=500){
                bars["five"]+=1;
            }
            else if(data[i].price>500 && data[i].price<=600){
                bars["six"]+=1;
            }
            else if(data[i].price>600 && data[i].price<=700){
                bars["seven"]+=1;
            }
            else if(data[i].price>700 && data[i].price<=800){
                bars["eight"]+=1;
            }
            else if(data[i].price>800 && data[i].price<=900){
                bars["nine"]+=1;
            }
            else if(data[i].price>900){
                bars["ten"]+=1;
            }

               
           
        }
        let k=1;
        for(let i in bars){
            document.getElementById(`bar${k}`).style.height=`${250*bars[i]/10}px`;
            k++;
        }
            document.getElementById("totSales").innerHTML=totSales.toFixed(2);
           document.getElementById("totSalesItems").innerHTML=totSold;     
            document.getElementById("totNotSalesItems").innerHTML=leftover;
        getDataByMonth.sort((a,b)=>a.id-b.id);
        setTransTable([...getDataByMonth]);
     
     setTen([...getDataByMonth.slice(0,10)]);


       
        setSelectedMonth(monthInWords[month-1]);
       
   
    

  }

  async function searchTransaction(e){
    let searchValue=document.getElementById("search").value.toLowerCase().trim();
    
    
   

    if(searchValue!==""){ 
        let getDataBySearch=[];
      
        
        for(let i in transTable){
            if(transTable[i].title.toLowerCase().indexOf(searchValue)>=0 || transTable[i].description.toLowerCase().indexOf(searchValue)>=0 || (transTable[i].price+"").indexOf(searchValue)>=0){
                getDataBySearch.push(transTable[i]);
            }
        }
       
        setTen([...getDataBySearch.slice(0,10)]);
          setSearchTable([...getDataBySearch]);
        
       setSearch(true);
       
    }
    else{
        setTen([...transTable.slice(0,10)]);
        setSearch(false);
    }



  }
  function handleTableData(move){
           
    let selectedTable=search?searchTable:transTable;
    
    if(move==='next'){
               let check=selectedTable.slice((page+1)*10,10+(page+1)*10);
        if(check.length>0){
            setTen([...check]);
        setPage(page+1); 
        setPagination("");
        }
        else{
            setPagination("You have reached the end.");
        }
    }
    else{
        if(page>0){
            setTen([...selectedTable.slice((page-1)*10,10+(page-1)*10)]);
        setPage(page-1);
        
        }
        setPagination("");
         
    }
  }
  
  return (
    <div id="app" className="container-fluid">
           <h1 className="text-center">Transaction Dashboard</h1>
           <div  >
            <div className='d-flex flex-wrap justify-content-between my-2 border rounded p-3' >
            <input type="text" placeholder="Search transaction" className='my-2 col-lg-6 col-md-7 col-xs-12 col-sm-12 p-2 ' id='search' onChange={(event)=>searchTransaction(event)} ></input>
            
            <select className="  col-lg-2 col-md-3  col-xs-12 col-sm-12   text-center " id='select'  onChange={getTransactions}><option value={3} >Select Month</option>
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
            </select>
            </div>
            
            <div className='border rounded p-3 my-3'>
            <table   id="transactionTable" className="col-12  text-center  my-1 " >
              <caption >Transaction Table</caption>
            
              <tbody  id='tbody'  >
              <tr>
                <th>Id</th>
                <th>title</th>
                <th>description</th>
                <th>price</th>
                <th>category</th>
                <th>sold</th>
                <th>image</th>
              </tr>
                 {Ten.length>0?Ten.map((item,index)=><tr key={index}><td>{item.id}</td><td id='title'>{item.title}</td><td id='desc'>{item.description}</td><td>{item.price}$</td><td>{item.category}</td><td> {item.sold?"true":"false"}</td><td><img alt='product_image' src={item.image}  id='productImage' ></img></td></tr>):<tr><td>No data found...</td></tr>}
              </tbody>
            </table>
            <div className='d-flex flex-wrap' id='pagination'>
                <button className='btn btn-dark col-lg-2 col-md-3 col-sm-12 col-xs-12 mx-auto my-2' onClick={()=>handleTableData('prev')}>Previous</button>
                <div className='col text-center'>{pagination!==""?pagination:page+1}</div>
                <button className='btn btn-dark col-lg-2 col-md-3 col-sm-12 col-xs-12 mx-auto my-2' onClick={()=>handleTableData('next')}>Next</button>
                </div>
            </div>
           
           </div>
           <div className='container-fluid my-4 border rounded p-3'>
            <h1 className='text-center'>Transaction Statistics</h1>
            
                <div className='row py-2'>

                    <div className='col-lg-3 col-md-3 col-xs-12 col-sm-12 my-2 p-1'>
                     <div className='border p-1 rounded'>
                     <div><h4>Statistics -{selectedMonth}</h4></div>
                     <div className='d-flex'><p className=' col'>Total Sales</p><p id='totSales' className='  col text-end p-2'>-</p></div>
                     <div className='d-flex'><p className='  col'>Total sold items</p><p id='totSalesItems' className='  col text-end p-2'>-</p></div>
                     <div className='d-flex'><p className=' col'>Total not sold items</p><p id='totNotSalesItems' className='  col text-end p-2'>-</p></div>
                     </div>
                    </div>
                    <div className='col-lg-9 col-md-9  col-xs-12 col-sm-12  my-2 p-1'>
                    < div className='border  rounded p-1 '><h4>Bar Chart Stats -{selectedMonth}</h4>
                    <div id='chart' className='d-flex flex-wrap my-3'>
                        <div className='position-relative col-12'>
                        <div className='position-absolute  ' id='levels'>
                            <div>100</div>
                            <div>80</div>
                            <div>60</div>
                            <div>40</div>
                            <div>20</div>
                        </div>
                        <div  className='col-12 itemRange d-flex '>
                            <div className='col-1'> </div>
                            <div className='col-11 ' >
                             <div className='  d-flex'>
                                <div className='barsContainer col px-2'><div className='barrrr' id='bar1'></div></div>
                                <div className='barsContainer col px-2'><div className='barrrr' id='bar2'></div></div>
                                <div className='barsContainer col px-2'><div className='barrrr' id='bar3'></div></div>
                                <div className='barsContainer col px-2'><div className='barrrr' id='bar4'></div></div>
                                <div className='barsContainer col px-2'><div className='barrrr' id='bar5'></div></div>
                                <div className='barsContainer col px-2'><div className='barrrr' id='bar6'></div></div>
                                <div className='barsContainer col px-2'><div className='barrrr' id='bar7'></div></div>
                                <div className='barsContainer col px-2'><div className='barrrr' id='bar8'></div></div>
                                <div className='barsContainer col px-2'><div className='barrrr' id='bar9'></div></div>
                                <div className='barsContainer col px-2'><div className='barrrr' id='bar10'></div></div>

                             </div>
                         
                            </div>
                           
                        </div>
                      
                         </div>
                        <div className='col-12 d-flex'>
                        <div className='col-1'></div>
                        <div className='col-11 d-flex my-2 py-4'>
                            <div className='col text-center rotateMe'>0-100</div>
                            <div className='col text-center rotateMe'>101-200</div>
                            <div className='col text-center rotateMe'>201-300</div>
                            <div className='col text-center rotateMe'>301-400</div>
                            <div className='col text-center rotateMe'>401-500</div>
                            <div className='col text-center rotateMe'>501-600</div>
                            <div className='col text-center rotateMe'>601-700</div>
                            <div className='col text-center rotateMe'>701-800</div>
                            <div className='col text-center rotateMe'>801-900</div>
                            <div className='col text-center rotateMe'>901 above</div>
                        </div>
                        </div>

                        
                    </div>
                    </div>
                        
                    </div>
                </div>
           
               
           </div>
         
        
    </div>
  );
}

export default App;
