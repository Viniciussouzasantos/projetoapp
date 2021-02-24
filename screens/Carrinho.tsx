import * as React from 'react';
import{View, Text, ActivityIndicator} from 'react-native';
import * as SQLite from 'expo-sqlite';
import{createStackNavigator} from '@react-navigation/stack'
import{ScrollView,StyleSheet,FlatList,Image, RefreshControl} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';





const Stack = createStackNavigator();
const db = SQLite.openDatabase("dbapploja.banco");
export default function Carrinho(){
   //Vamos criar ou abrir o banco de dados relacionada ao carrinho


return(
    <Stack.Navigator styles={styles.header}>
        <Stack.Screen name="ItensCarrinho" component = {ItensCarrinho} options ={{headerShown:false}} />
        <Stack.Screen name="Pagamento" component = {Pagamento}/>
    </Stack.Navigator>
);
}

const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  


function ItensCarrinho(){
const[carregando,setCarregando] = React.useState (true);
    const [produtos, setProdutos] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

//condificação de atualização dos controles de tela

const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  db.transaction((tx) => {
    tx.executeSql("select * from carrinho", [], (_, { rows: { _array } }) => {
      setProdutos(_array);
    });
  });
  wait(2000).then(() => setRefreshing(false));
}, []);

    
    React.useEffect(()=>{

        db.transaction((sl)=>{
            sl.executeSql("select * from carrinho", [],(_,{rows})=>{
               // console.log("---------------------------------------");
             // console.log(JSON.stringify(rows,_array));
              setProdutos(rows._array );
              setCarregando(false);
            });
          });
    },[]); 
       
        return(
           
            <ScrollView horizontal = {true} style = {styles.scrollview}  refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              >
{carregando ? (<ActivityIndicator/>):(<FlatList data = {produtos} renderItem = {({item})=>(
    <View>
        <Text>Nome produto {item.nomeproduto}</Text>
        <Text>Preço R$ {item.preco}</Text>
        <TouchableOpacity onPress = {()=>{
           // alert("Clicou"); 
           db.transaction((ts)=>{
           ts.executeSql("delete from carrinho where id=?",[item.id]);
           alert("item excluido");
        
           })
        }} style = {styles.btnApagar}>
<Text style = {styles.txtApagar}>Excluir</Text>

        </TouchableOpacity>
        
        <TouchableOpacity onPress = {()=>{
alert("clicou");


        }} style ={styles.btnApagar}>
          <Text style = {styles.txtApagar}>clique</Text>
          

        </TouchableOpacity>
    </View>
)}
keyExtractor = {({id},index) => id}
/>
)}



            </ScrollView>
        )



}
function Pagamento(){
return(
<View>

<Text>Pagamento</Text>

</View>

)


}




  

const styles = StyleSheet.create({
scrollview:{
flex:1,
alignContent:'center'
//justifyContent: 'center'

},
btnApagar:{
    padding:10,
    backgroundColor:'green',
    margin:5
},
txtApagar:{
    color:'white',
},
header:{
backgroundColor:'green'

}


})