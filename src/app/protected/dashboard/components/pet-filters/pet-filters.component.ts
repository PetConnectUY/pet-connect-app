import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pet-filters',
  templateUrl: './pet-filters.component.html',
  styleUrls: ['./pet-filters.component.scss']
})
export class PetFiltersComponent implements OnInit {
  faFilter = faFilter;

  form!: FormGroup;

  fieldHasContent: { [key: string]: boolean } = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      name: [''],
      birth_date: [''],
    });
    Object.keys(this.form.controls).forEach(controlName => {
      const control = this.form.get(controlName);
      if (control && control.value) {
          this.fieldHasContent[controlName] = control.value.trim() !== '';
      }
    });
  }

  ngOnInit(): void {
    
  }

  hasContent(controlName: string): boolean {
    const controlValue = this.form.get(controlName)?.value;
    return controlValue ? controlValue.trim() !== '' : false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const formControl = this.form.get(fieldName);
    return !!formControl && formControl.invalid && formControl.touched;
  }
  
  isFieldValid(fieldName: string): boolean {
    const formControl = this.form.get(fieldName);
    return !!formControl && formControl.valid && formControl.touched;
  }
}
