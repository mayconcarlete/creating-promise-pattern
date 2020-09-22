import { TsPromise } from "../src/ts-promise"


describe('Promise Pattern', ()=>{
    test('Should create a new Promise with pending state', () =>{
        const tsPromise = new TsPromise(() => {})
        expect(tsPromise.state).toBe('pending')
        expect(tsPromise.value).toBe(undefined)
        
    })
})

describe('When Fullfilled', ()=> {

    test('Should then a promise', done => {
        return new TsPromise( (resolve: (arg0: { data: string }) => void) => {
            resolve({data:'fake'})
        }).then((response: { data: any }) =>{
            expect(response.data).toBe('fake')
            done()
        })
    })
    test('Should call then just when async code is resolved', done => {
        return new TsPromise((resolve: (arg0: { data: string }) => void) => {
            setTimeout(()=>{
                resolve({data:'fake'})
            },100)
        }).then((response: { data: any }) => {
            expect(response.data).toBe('fake')
            done()
        })

    })
    test('Should allow same promise to be thenable multiple times', done =>{
        const p1 = new TsPromise((resolve: (arg0: { data: string }) => void) => setTimeout(() => {resolve({data:'fake'})}, 200))
        p1.then((response: { data: any }) => expect(response.data).toBe('fake') )
        p1.then((response: { data: any }) =>{ 
            expect(response.data).toBe('fake')
            done()
        })
    })
    test('Should suport chain of promises on wich promises are returned', done =>{
        const fsPromise = new Promise(resolve => setTimeout(()=>{resolve({file:'photo.jpg'})}, 100))
        return new TsPromise((resolve: (arg0: { data: string }) => void) =>{
            setTimeout(()=>{
                resolve({data:'promise1'})
            },100)
        }).then((response: { data: any }) =>{
            expect(response.data).toBe('promise1')
            return fsPromise
        })
        .then((response: { file: any }) =>{
            expect(response.file).toBe('photo.jpg')
            done()
        })

    })
})

describe('Error handling', ()=>{
    test('Should call catch when an error is thrown', done => {
        const errorMessage = 'Promise has been rejected'
        return new TsPromise((resolve: any, reject: (arg0: Error) => void) => {
            setTimeout(()=>{reject(new Error(errorMessage))}, 10)
        })
        .catch(function (e: { message: any }) {
                expect(e.message).toBe(errorMessage)
                done()
            })
    })
    test('Should allow catch to be thenable', done =>{
        const errorMessage = 'Promise has been rejected'
        return new TsPromise((resolve: any, reject: (arg0: Error) => void) => {
            setTimeout(()=>{reject(new Error(errorMessage))}, 10)
        })
        .catch(function (e: { message: any }) {
                expect(e.message).toBe(errorMessage)
                return {data:'someData'}
        })
        .then((response: { data: any }) => {
            expect(response.data).toBe('someData')
            done()
        })
    })
    test('Should allow catch an error by a previous catch method', done =>{
        const errorMessage = 'Promise has been rejected'
        return new TsPromise((resolve: any, reject: (arg0: Error) => void) => {
            setTimeout(()=>{reject(new Error(errorMessage))}, 10)
        })
        .catch(function (e: { message: any }) {
                expect(e.message).toBe(errorMessage)
                throw new Error('Thats a new error')
        })
        .catch((e: { message: any })=>{
            expect(e.message).toBe('Thats a new error')
            done()
        })
    })
})