const enum state {
    PENDING = 'pending',
    FULFILLED = 'fulfilled',
    REJECTED = 'rejected'
}

export class TsPromise {
    state:string
    value:any
    onFulfillChain:any[]
    onRejectCallChain:any[]
    
    constructor(executor:Function){
        if(typeof(executor) !=='function'){
            throw new Error('Executor must be a function')
        }
        this.state = state.PENDING
        this.value = undefined
        this.onFulfillChain =[]
        this.onRejectCallChain=[]

        //para emular o processa asyncrono, deveriamos adicionar o process.nextTick(), pois ele 
        //jogar a tarefa para a micro task.
       // process.nextTick(() => executor(this.resolve.bind(this))) 
       executor(this.resolve.bind(this), this.reject.bind(this))
    }
 
    then(onFulFill:any){
        return new TsPromise((resolve: (arg0: any) => void) => {
            const onFulFilled = (res: any) => resolve(onFulFill(res))
            if(this.state === state.FULFILLED){
                onFulFilled(this.value)
            }else{
                this.onFulfillChain.push(onFulFilled)
            }
        })
    }
    catch(onReject:any){
        return new TsPromise(( resolve: (arg0: any) => void, reject: any) => {
            const onRejected = (res: any) =>{
                try{
                    resolve(onReject(res))
                }catch(error){
                    reject(error)        
                }
            }
            
            if(this.state === state.REJECTED){
                onRejected(this.value)
            }else{
                this.onRejectCallChain.push(onRejected)
            }

        })
    }
    resolve(res:any){
        if(this.state !== state.PENDING){
            return;
        }
        
        if(res != null && typeof res.then =='function'){
            return res.then(this.resolve.bind(this))
        }

        this.state = state.FULFILLED
        this.value = res
        for(const onFulFilled of this.onFulfillChain){
            onFulFilled(res)
        }
    }
    reject(error: any){
        if(this.state !== state.PENDING){
            return;
        }
        this.state = state.REJECTED
        this.state = error
        for(const onRejected of this.onRejectCallChain){
            onRejected(error)
        }
    }
}