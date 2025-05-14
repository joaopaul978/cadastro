import Axios from "axios";

const api = Axios.create({
    baseURL:`http://localhost:3001/`
});


/* export const useApi = () =>({
    validateToken: async (token: string) => {
        const response = await api.post("/api/validate",{token})
        return response.data; 
    },

    signIn: async (username: string, password: string) =>{
        
       const response = await api.post("http://localhost:3001//api/login",{username, password});
       console.log('Tela useApi',response.data);   
           
       return response.data;       
    },
    

    logout: async () =>{
        const response = await api.post("/api/logout");
        return response.data; 
    }
}); */