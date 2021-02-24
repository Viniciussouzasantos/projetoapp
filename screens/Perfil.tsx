import * as React from 'react';
import{View, Text, RefreshControl,ActivityIndicator,FlatList,NativeModules} from 'react-native';
//import { Text, View } from "../components/Themed";
import { StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";
import { Image } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { createStackNavigator } from '@react-navigation/stack';
import { ScreenStack } from 'react-native-screens';

const db = SQLite.openDatabase("appvendadb.banco");


const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default function Perfil() {

  const[carregando,setCarregando] = React.useState (true);  
  const [perfil, setPerfil] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    db.transaction((tx) => {
      tx.executeSql("select * from perfil", [], (_, { rows: { _array } }) => {
        setPerfil(_array);
      });
      tx.executeSql("commit");
    });
    
    wait(2000).then(() => setRefreshing(false));
  }, []);
  
  React.useEffect(()=>{

    db.transaction((sl)=>{
        sl.executeSql("select * from perfil", [],(_,{rows})=>{
           // console.log("---------------------------------------");
         // console.log(JSON.stringify(rows,_array));
          setPerfil(rows._array );
          setCarregando(false);
        });
        sl.executeSql("commit")
      });
},[]); 

    
  
    // React.useEffect(() => {
    //   db.transaction((tx) => {
    //     tx.executeSql("select * from perfil", [], (_, { rows: { _array } }) => {
    //       console.log("placeholder")
    //       setPerfil(_array);   
    //     });
    //   });
    // }, []);
{/*
    return(

<ScrollView horizontal = {false} style = {tela.scrollview}  refreshControl={
<RefreshControl refreshing={refreshing} onRefresh = {onRefresh} />
}>
  
  <View>
             { <Text style={tela.rotulos}>Perfil</Text> 

            {perfil.map(
        ({
          id,
          idusuario,
          nomeusuario,
          foto,
          nomecliente,
          cpf,
          
          email,
          telefone,
          tipo,
          logradouro,
          numero,
          complemento,
          bairro,
          cep,
          logado,
        }) => (
          <View style={{ flex: 1 }} key={id}>
            <Image
             source={{ uri: `http://10.26.45.48/vinicius_souza/loja/img/${foto}` }}
              style={tela.img}
            />
            <Text style={tela.txtrotulos}>Usuário:{nomeusuario}</Text>
            <Text  style={tela.txtrotulos}>Nome:{nomecliente}</Text>
            <Text  style={tela.txtrotulos}>CPF:{cpf}</Text>
        
            <Text  style={tela.txtrotulos}>E-Mail:{email}</Text>
            <Text  style={tela.txtrotulos}>Telefone:{telefone}</Text>
            <Text  style={tela.txtrotulos}>Tipo:{tipo}</Text>
            <Text  style={tela.txtrotulos}>Logradouro:{logradouro}</Text>
            <Text  style={tela.txtrotulos}>Número:{numero}</Text>
            <Text  style={tela.txtrotulos}>Complemento:{complemento}</Text>
            <Text  style={tela.txtrotulos}>Bairro:{bairro}</Text>
            <Text  style={tela.txtrotulos}>CEP:{cep}</Text>

            <TouchableOpacity>
              <Text  style={tela.txtrotulos}>Atualizar Perfil</Text>
            </TouchableOpacity> 
 
          </View>
        )
      )}
           <TouchableOpacity onPress={()=>{
       logout()
      }} style={tela.btnsair}>
        <Text  style={tela.txtrotulos}>Sair do perfil</Text>
      </TouchableOpacity>
</View>

</ScrollView>
    
    );
}
*/}


const Stack = createStackNavigator();


return(
           
  <ScrollView horizontal = {true} style = {tela.scrollview}  refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
    >
{carregando ? (<ActivityIndicator/>):(<FlatList data = {perfil} renderItem = {({item})=>(
<View>
  
<Text style={tela.txtrotulos}>Usuário:{item.nomeusuario}</Text>
<Text  style={tela.txtrotulos}>Nome:{item.nomecliente}</Text>
<Text  style={tela.txtrotulos}>CPF:{item.cpf}</Text>
<Text  style={tela.txtrotulos}>E-Mail:{item.email}</Text>
<Text  style={tela.txtrotulos}>Telefone:{item.telefone}</Text>
<Text  style={tela.txtrotulos}>Tipo:{item.tipo}</Text>
<Text  style={tela.txtrotulos}>Logradouro:{item.logradouro}</Text>
<Text  style={tela.txtrotulos}>Número:{item.numero}</Text>
<Text  style={tela.txtrotulos}>Complemento:{item.complemento}</Text>
<Text  style={tela.txtrotulos}>Bairro:{item.bairro}</Text>
<Text  style={tela.txtrotulos}>CEP:{item.cep}</Text>
<TouchableOpacity onPress = {()=>{
 // alert("Clicou"); 
 db.transaction((ts)=>{
 ts.executeSql("delete from perfil");
 alert("saiu");
 NativeModules.DevSettings.reload();
 

 })
}} style = {tela.btnApagar}>
<Text style = {tela.txtApagar}>sair do perfil</Text>

</TouchableOpacity>
</View>
)}
keyExtractor = {({id},index) => id}
/>
)}



  </ScrollView>
)



}


function logout(){
  db.transaction((rx) => {
    rx.executeSql("delete from perfil", [], (_, { rows: { _array } }) => {
      console.log(_array);
    });
    rx.executeSql("commit")
  });
 
      console.log("placeholder ");  

 
}


const tela = StyleSheet.create({
    img: {
      width: 100,
      height: 100,
      flex: 1,
      
      resizeMode: "contain",
    },
    link: {
      padding: 10,
    },
perfil:{
backgroundColor:'green',

},
rotulos:{
  width:150,
  //textAlign:'center',
  padding:5,
  fontWeight:'bold'
},
txtrotulos:{
  flex:1,
  marginLeft:10
},
scrollview:{
  flex:1,
  // marginTop:100,
  alignContent:'center',
width:'100%',
textAlign:'center',
padding:50
},
btnsair:{
 
  width:100,
  height:30,
  margin:10
},
btnApagar:{
    padding:10,
    backgroundColor:'green',
    margin:5
},
txtApagar:{
    color:'white',
},


  });