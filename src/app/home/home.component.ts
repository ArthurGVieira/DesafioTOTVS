import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Contato } from '../Contato';
import { Conversa } from '../Conversa';
import { DataService } from '../data.service';
import { interval } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('400ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {

  select: any = 'Conversas';
  conversa_aberta: boolean = false;
  conversa_aberta_obj: Conversa = {
    id: 0,
    nome: "0",
    mensagens: [["", 1, false]]
  };
  contatos: Contato[] = [];
  conversas: Conversa[] = [];
  data: any;
  last_id: number = -1;
  mensagem_text: string = '';
  nome_new_user: string = '';
  id_chat_new_user: string = '';
  cadastro: boolean = false;
  corConversas: string = "#334390";
  corContatos: string = "#4054b4";
  update_id: number[] = []

  constructor(private dataService: DataService) { 

  }

  // Assim que o componente é iniciado, executa o event_handler da aplicação de 1 em 1 segundo
  // para checar novas mensagens e lidar com elas
  ngOnInit() {
    interval(1000).subscribe(() => {
      this.event_handler();
    })
  }

  // Alterna entre a seção conversas e a seção contatos
  mudar_select(event: MouseEvent) {

    const elementoClicado = event.target as HTMLElement;
    const conteudoElementoClicado = elementoClicado.textContent;
    
    if (conteudoElementoClicado != this.select) {
      this.select = conteudoElementoClicado
    }
    if (this.select == 'Conversas') {
      this.corConversas = "#334390";
      this.corContatos = "#4054b4";
    } else {
      this.corConversas = "#4054b4";
      this.corContatos = "#334390";
    }
  }

  // Abre um div contendo uma conversa
  abrir_conversa(event: MouseEvent) {

    this.conversa_aberta = true;

    const elementoClicado = event.target as HTMLElement;
    const conversa: any = this.conversas.find(result => result.id === parseInt(elementoClicado.id));

    for (const msg of conversa.mensagens) {
      msg[2] = true
    }

    this.conversa_aberta_obj = conversa
  }

  fechar_conversa() {
    this.conversa_aberta = false;
    this.conversa_aberta_obj = {
      id: 0,
      nome: "0",
      mensagens: [["", 1, false]]
    };
  }

  // Contata o data.service para fazer requests na API e atualizar a variável que contém os dados
  update_data(): void {
    this.dataService.get_updates().subscribe((response) => {
      this.data = response;
    })
  }

  // Usa a variável last_id para checar novas mensagens
  // checar_nova_msg(): boolean {
  //   if (this.data.result[this.data.result.length - 1].message.message_id != this.last_id) {
  //     this.last_id = this.data.result[this.data.result.length - 1].message.message_id
  //     console.log('NOVA MENSAGEM')
  //     return true
  //   }
  //   return false
  // }

  // Usa a lista com os id de updates para checar novas mensagens
  checar_nova_msg(): boolean {
    if (!this.update_id.includes(this.data.result[this.data.result.length - 1].update_id)) {
      this.update_id.push(this.data.result[this.data.result.length - 1].update_id)
      console.log('NOVA MENSAGEM')
      return true
    }
    return false
  }

  // Verifica se a nova mensagem que chegou é de uma conversa existente ou se é uma nova conversa
  checar_novo_chat(): boolean {
    for (const conversa of this.conversas) {
      if (this.data.result[this.data.result.length - 1].message.from.id == conversa.id) {
        return false
      }
    }
    return true
  }

  criar_chat(): void {
    this.conversas.push({
      id: this.data.result[this.data.result.length - 1].message.from.id,
      nome: this.data.result[this.data.result.length - 1].message.from.first_name,
      mensagens: [[this.data.result[this.data.result.length - 1].message.text, 1, false]]
    })
  }

  append_msg(): void {
    
    const conversa: any = this.conversas.find(result => result.id === this.data.result[this.data.result.length - 1].message.from.id);
    
    if (this.conversa_aberta_obj.id == this.data.result[this.data.result.length - 1].message.from.id){
      conversa.mensagens.push([this.data.result[this.data.result.length - 1].message.text, 1, true])
    } else {
      conversa.mensagens.push([this.data.result[this.data.result.length - 1].message.text, 1, false])

    }
  }

  // Realiza um pedido de post no data.service para enviar a mensagem e seu conteúdo ao usuário
  enviar_msg(): void {
    if (this.mensagem_text != "") {
      const data = {
        chat_id: this.conversa_aberta_obj.id,
        text: this.mensagem_text
      }

      const conversa: any = this.conversas.find(result => result.id === this.conversa_aberta_obj.id);
      conversa.mensagens.push([this.mensagem_text, 0, true])

      this.dataService.send_message(data)

      this.mensagem_text = ""
    }
  }

  cadastrar_contato(): void {
    this.cadastro = true
  }

  fechar_cadastro(): void {
    this.cadastro = false
  }

  // Realiza o cadastro de novos contatos adicionando eles na variável contatos: Contatos[]
  realizar_cadastro(): void {

    const novo_contato: Contato = {
      id: this.id_chat_new_user,
      nome: this.nome_new_user
    }
    const conversa: any = this.conversas.find(result => result.id === parseInt(this.id_chat_new_user));

    if (conversa) {
      conversa.nome = this.nome_new_user
    } else {
      this.conversas.push({
        id: parseInt(this.id_chat_new_user),
        nome: this.nome_new_user,
        mensagens: [['', 0, true]]
      })
    }

    this.contatos.push(novo_contato)
    this.cadastro = false
    this.nome_new_user = ''
    this.id_chat_new_user = ''
  }

  // Função que lida com os eventos de request que ocorrem na aplicação
  event_handler(): void {

    this.update_data()
    if (this.checar_nova_msg()) {
      if (this.checar_novo_chat()) {
        this.criar_chat()
      } else {
        this.append_msg()
      }
      console.log(this.conversas)
    }
  }
}
