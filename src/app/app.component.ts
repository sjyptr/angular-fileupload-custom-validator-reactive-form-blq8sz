import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  // Array of valid extensions
  allowedFileExtensions = ['png'];

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {}

  /**
   * Init Form
   */
  createForm() {
    this.form = this.fb.group({
      photo: [
        { value: '', disabled: false },
        [this.fileUploadValidator(this.allowedFileExtensions)],
      ],
    });
  }

  /**
   * Custom Validator for Upload File extensions
   * @param allowedExtensions any
   */
  fileUploadValidator(allowedExtensions: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      // Enter to validation only if has value or it's not undefined
      if (control.value !== undefined && isNaN(control.value)) {
        const file = control.value;
        // Get extension from file name
        const ext = file.substring(file.lastIndexOf('.') + 1);
        // Find extension file inside allowed extensions array
        if (ext.toLowerCase() == 'csv') {
        } else {
          return { extensionFile: true };
        }
      }
      return null;
    };
  }

  /**
   * Give value to form field of input file
   * @param files FileList
   */
  handleFileInput(input) {
    const file = input.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const file = event.target.result;
      const allLines = file.split(/\r\n|\n/);
      let validFile = true;
      console.log(allLines);
      allLines.forEach((line) => {
        if (line != '') {
          validFile = false;
        }
        this.form.controls['photo'].setErrors({ incorrect: validFile });

        console.log(this.form.get('photo'));
      });
    };

    reader.onerror = (event) => {
      alert(event.target.error.name);
    };

    reader.readAsText(file);
  }
}
