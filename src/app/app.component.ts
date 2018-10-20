import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Player } from './player.model';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DialogViewComponent } from './dialog-view/dialog-view.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['name', 'surName', 'email', 'phone', 'edit'];
  playersForm;
  selectedRow;
  winner: Player;
  playersList: Player[] = [];
  private playersUpdated = new Subject<Player[]>();

  validation_messages = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'minlength', message: 'Name must be at least 3 characters long' },
      { type: 'maxlength', message: 'Name cannot be more than 25 characters long' },
      { type: 'pattern', message: 'Your Name must contain only letters' }
    ],
    surname: [
      { type: 'required', message: 'Surname is required' },
      { type: 'minlength', message: 'Surname must be at least 3 characters long' },
      { type: 'maxlength', message: 'Surname cannot be more than 25 characters long' },
      { type: 'pattern', message: 'Your Surname must contain only letters' }
    ],
    email: [{ type: 'pattern', message: 'Enter a valid email' }],
    phone: [{ type: 'pattern', message: 'Enter a valid email' }]
  };

  constructor(private fb: FormBuilder, public dialog: MatDialog) {}

  ngOnInit() {
    this.playersForm = this.fb.group({
      name: ['',
        Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(3),
          Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$"),
          Validators.required
        ])
      ],
      surName: ['',
        Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(3),
          Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$"),
          Validators.required
        ])
      ],

      email: ['',
        Validators.compose([Validators.maxLength(30), Validators.pattern('[^@]+@[^.]+..+')])
      ],
      phone: ['',
        Validators.compose([Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$')])
      ]
    });
  }

  get f() {
    return this.playersForm.controls;
  }

  addPlayer(playerData) {
    this.playersList.push(playerData);
    this.playersUpdated.next([...this.playersList]);
    this.playersForm.reset();
    console.log(this.playersList);
  }

  setWinner() {
    const winnerIndex = Math.floor(Math.random() * this.playersList.length);
    this.winner = this.playersList[winnerIndex];
    this.selectedRow = this.winner;
  }
  openDialog(index): void {
    const dialogRef = this.dialog.open(DialogViewComponent, {
      width: '250px',
      data: {
        name: this.playersList[index].name,
        surname: this.playersList[index].surName,
        email: this.playersList[index].email,
        phone: this.playersList[index].phone,
        id: index
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.playersList[result.id] = result;
        this.playersUpdated.next([...this.playersList]);
      }
    });
  }
}
