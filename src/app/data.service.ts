import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


// Serviço usado para fazer a comunicação e os requests na Api do telegram
@Injectable()
export class DataService {
  base_url: string = "https://api.telegram.org/bot6618202005:AAGTPbK-6Wmq34bf9VE3Af3_Mk2LQhlmm50"
  methods: string[] = [
    "/getupdates",
    "/sendmessage"
  ]
  
  constructor(private http: HttpClient) { 

  }

  get_updates(): Observable<any> {
    const url = this.base_url + this.methods[0]
    return this.http.get(url);
  }

  send_message(data: any): void {
    const url = this.base_url + this.methods[1]
    this.http.post(url, data).subscribe(response => {
      console.log(response)
    })
  }
}