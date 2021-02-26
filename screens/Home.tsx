import * as React from 'react';
import{ Alert, Modal, StyleSheet, TouchableHighlight, TouchableOpacity , ImageBackground,
   View, Text, Touchable, ActivityIndicator, SliderBase, Button} from 'react-native';
import {host} from '../config/host';
import { TextInput } from "react-native-gesture-handler";
import{createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";
import{ScrollView,FlatList,Image} from 'react-native';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("appvendadb.banco");

let us = "";
let sh = "";
let rt = false;
const Stack = createStackNavigator();

export default function Home(){



  
// vamos empilhar as duas telas relacionadas aos produtos. começamos com a tela de listar produtos e vamos para a tela de detalhes
return(
  <Stack.Navigator>
    <Stack.Screen name="Login" component={telaModal}/>
    <Stack.Screen name ="ListarProdutos" component= {ListarProdutos} options ={{headerShown:false}}  />
    <Stack.Screen name = "DetalhesProduto" component ={DetalhesProduto}/>
  
  </Stack.Navigator>
)

}


// ----------- Tela de Lista de Produtos ---------------------------------------------------

function ListarProdutos({navigation}){
const[carregado,setCarregado] = React.useState (true);
const[info,setDados] = React.useState([]);
React.useEffect(()=>{
fetch("http://10.26.45.48/vinicius_souza/loja/service/produto/listartelainicial.php",
{
method:"GET",
headers:{
  accept:"aplication/json",
  "content-type":"aplication/json"
}
}
)
.then((response)=>response.json())
.then((produto)=>{
  setDados(produto.saida)
  console.log(produto.saida)
})
.catch((erro)=>console.error(`Erro ao tentar carregar a api ${erro}`))
.finally(()=>setCarregado(false))
},[])

  return(  

<ScrollView style={styles.scrollview} horizontal={true}>
  {/* <Image source = {{uri:host + "vinicius_souza/loja/img/monitor1.png"}} style ={styles.foto}/> */}

{/* criação da estrutura de lista de dados que vem da api. vamos usar o comando FlatList para construir a lista
até que a lista seja totalmente carregada iremos ver em tela uma animação de um circulo girando realizando o carregamento dos dados
Essa animação feita com o comando ActivityIndicator
*/}

{carregado ?
(<ActivityIndicator/>):(

<FlatList
data ={info}
renderItem={({item})=>(
  <View>
<Text>{item.nomeproduto}</Text>
<Text>{item.preco}</Text>
<TouchableOpacity onPress={()=>{
  navigation.navigate("DetalhesProduto",{idproduto:`${item.idproduto}`})
}} style={styles.abrirDetalhe}>

  <Text style={styles.txtAbrirDetalhe}> Saiba mais</Text>

</TouchableOpacity>

  </View>
)}
keyExtractor = {({idproduto},index)=> idproduto }
/>

)
}

</ScrollView>

  );
}


//----------------------------Tela de Detalhes do Produto --------------------------------------





function DetalhesProduto({route}){

//Vamos criar ou abrir o banco de dados relacionada ao carrinho
const db = SQLite.openDatabase("dbapploja.banco");

const{idproduto} = route.params;

const[produto,setProduto] = React.useState ([])
const[carregando,setCarregando] = React.useState (true); 
React.useEffect(()=>{
fetch(`http://10.26.45.48/vinicius_souza/loja/service/produto/detalheproduto.php?idproduto=${idproduto}`)
.then((response)=>response.json())
.then((valores)=> setProduto(valores.saida))
.catch((erro)=>console.error(`Erro ao ler a api ${erro}`))
.finally(()=>setCarregando(false))
},[])

  return(
<View> 

<Text>Detalhes Produto</Text>
<Text> {idproduto} </Text>
{carregando ? (
  <ActivityIndicator/>
  ):(
  <FlatList data={produto}
  renderItem={({item}) =>(  
  <View>
    <Text>nome do produto :{item.nomeproduto}</Text>
    <Text>Descricao:{item.descricao}</Text>
    <Text>preço : R$ {item.preco}</Text>
    
    <TouchableOpacity onPress={()=>{
          
          //Vamos criar/abrir a tabela com o comando 
          //comando abaixo e inserir os dados
          // do carrinho 
          db.transaction((tx)=>{
            tx.executeSql("create table if not exists carrinho(id integer primary key, idproduto int, nomeproduto text, preco text, foto text)");
          });
          
          //Após a criação da tabela carrinho 
          //o produto será inserido na tabela afim de 
          //adicionálo ao carrinho e posteriormente 
          //realizar o fechamento da compra 

          db.transaction((ct)=>{
            ct.executeSql("insert into carrinho(idproduto,nomeproduto,preco,foto)values(?,?,?,?)", [item.idproduto,item.nomeproduto,item.preco,item.foto1]);
          });
          //db.transaction((sl)=>{
           // sl.executeSql("select * from carrinho", [],(_,{rows})=>{
            //  console.log(JSON.stringify(rows));
           // });
         // });
          /* o comando realiza a exclusão da tabela carrinho
          db.transaction((gx)=>{
            gx.executeSql("drop table carrinho");
          });*/


 alert("adicionado!");}}style={styles.addCarrinho}>
  
  <Text style={styles.txtAddCarrinho}>
    Adicionar ao Carrinho
  </Text>
  
  
  </TouchableOpacity>    
  </View>)
}
keyExtractor={({idproduto},index)=>idproduto}

/>
  )
}
  
</View>
  );

  }
 


  //------------------------- Tela do Modal ------------------------------------
  function telaModal({navigation}){
    const [modalVisible, setModalVisible] = React.useState(true);
    const [usuario, setUsuario] = React.useState("");
    const [senha, setSenha] = React.useState("");
  
 
    /*  Criando duas constantes para visualizar ou não o modal,
      estamos iniciando o modal com visible false isso faz com que a tela de modal não apareça.
     essa tela ira aparecer quando o comando set modal visible for true */


    
     return(
      
      <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* <Text style={styles.modalText}>   */}
        <Text style={styles.textStyle}>Tudo da Terra</Text>
             
            <TextInput
          placeholder="Usuário"
           style={styles.acesso}
           onChangeText={(value) => setUsuario(value)}
           value={usuario}
        />

        <TextInput
          secureTextEntry
          placeholder="Senha"
           style={styles.acesso}
           onChangeText={(value) => setSenha(value)}
          value={senha}
        />

        <TouchableOpacity
           style={styles.logar}
           onPress={() => {
            

            //   if(rt == true){
            //   for( var i =0 ; i <2 ; i++){
            //     exibir = false;
            //     //setModalVisible(false);
            //     alert("Bem Vindo");
               
            //     navigation.navigate("ListarProdutos")  
            // }
            // console.log("Dados da tela do modal ------- "+exibir);
            
              setModalVisible(false);
              navigation.navigate("ListarProdutos")
             
          }}
        >
          <Text style = {styles.txtlogar}> Logar </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress ={()=>{
          alert("clicou");
        <TextInput placeholder="usuario" style = {styles.acesso}></TextInput>


        }} style={styles.cadastro}>
          <Text style={styles.txtlogar}> Cadastrar </Text>
          
        </TouchableOpacity>




            {/* <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
              onPress={() => {
                setModalVisible(!modalVisible);
                navigation.navigate("ListarProdutos")
              }}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableHighlight> */}
            </View>
          </View>
      </Modal>
      </View>
    );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    paddingTop:'50%',
    width:'100%',
    height:'100%',
    margin: 20,
    zIndex:10000,
    backgroundColor: 'green',
    borderRadius: 0,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  acesso:{
//color:'white',
backgroundColor:'white',
width: 300,
textAlign:'center'
   },

   logar:{
    width: 150,
    backgroundColor: 'white',
    padding:5,
    margin:10,
    borderRadius:100,
    textAlign:'center'

   },

  openButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color:'white',
  },

//const styles = StyleSheet.create({
  abrirDetalhe:{
  padding: 10,
  backgroundColor:'green',
  margin: 10
  },
  txtAbrirDetalhe:{
  color:'white',
  fontSize: 15
  },
  scrollview:{
  flex:1 ,
  marginTop:10
  
  },
  foto:{
  width:'100%',
  height:50
  
  },
  
  addCarrinho:{
  width: 150,
  backgroundColor: 'green',
  padding:5,
  margin:10
  
  },
  txtAddCarrinho:{
  fontSize:12 ,
  fontWeight:'bold',
  color:'white',
  textAlign: 'center'
  },
  cadastro:{
    width: 150,
    backgroundColor: 'white',
    padding:5,
    margin:10,
    borderRadius:100,
    textAlign:'center'




  },
  txtlogar:{
textAlign:'center',
fontWeight:'bold'

  }



});
let md = true;
function logar() {

  fetch("http://10.26.45.48/vinicius_souza/loja/service/usuario/login.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nomeusuario: us,
      senha: sh,
    }),
  })
    .then((response) => response.json())
    .then((resposta) => {
      if(resposta == 0){
        alert("Usuário não encontrado");
        return;        
      }
      else{
        gravarPerfil(resposta.saida[0]);
        // alert("Bem Vindo");
        return rt = true;
        
      }
    })
    .catch((error) => console.error(error));
}

function gravarPerfil(dados) {
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists perfil(id integer primary key, idusuario int , nomeusuario text, foto text,idcliente text, nomecliente text, cpf text,sexo text, email text, telefone text, tipo text, logardouro text, numero text, complemento text, bairro text, cep text, logado int);"
    );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "insert into perfil(idusuario, nomeusuario, foto,idcliente, nomecliente, cpf,sexo, email, telefone, tipo, logardouro, numero, complemento, bairro, cep, logado)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        dados.idusuario,
        dados.nomeusuario,
        dados.foto,
        dados.idcliente,
        dados.nomecliente,
        dados.cpf,
        dados.sexo,
        dados.email,
        dados.telefone,
        dados.tipo,
        dados.logradouro,
        dados.numero,
        dados.complemento,
        dados.bairro,
        dados.cep,
        1,
      ]
    );

    tx.executeSql("select * from perfil", [], (_, { rows }) => {
      console.log("tela home")
      
      console.log(rows);
    });
  });
}