import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../Services/employee.service';
import { Employee } from '../../Models/employee';
import { CommonModule } from '@angular/common';
import { isValidDate } from 'rxjs/internal/util/isDate';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit{
@ViewChild('myModal') model : ElementRef | undefined;

employeeList : Employee[] = [];
empService = inject(EmployeeService);


employeeForm : FormGroup = new FormGroup({});
constructor(private fb : FormBuilder, private toast: NgToastService){}
ngOnInit(): void {
  this.setFormState();
  this.getEmployees();
}
  openModal(){
    const empModal = document.getElementById('myModal');
       if(empModal != null){
        empModal.style.display = 'block';
       }
  }

  closeModal(){
    this.setFormState();
    if(this.model!=null){
      this.model.nativeElement.style.display="none";
    }
  }

  getEmployees(){
    this.empService.getAllEmployees().subscribe((res)=>{
      this.employeeList = res;
    })
  }

  setFormState(){
    this.employeeForm = this.fb.group({
      id: [0],
      name: ['',[Validators.required]],
      email: ['',[Validators.required]],
      mobile: ['',[Validators.required]],
      age: ['',[Validators.required]],
      salary: ['',[Validators.required]],
      status: [false,[Validators.required]],
      
    });
  }

  formValues: any
  onSubmit(){
    console.log(this.employeeForm.value);
    if(this.employeeForm.invalid){

      alert('Please fill all fields');
      return;
    }

    if(this.employeeForm.value.id == 0){
      this.formValues = this.employeeForm.value;
      this.empService.addEmployee(this.formValues).subscribe((res)=>{
        // alert('Employee Added Successfully');
        this.getEmployees();
        this.employeeForm.reset();
        this.closeModal();
      this.toast.success('Employee Added Successfully', 'SUCCESS', 3000)

      })

    }else{
      this.formValues = this.employeeForm.value;
    this.empService.updateEmployee(this.formValues).subscribe((res)=>{
      // alert('Employee Updated Successfully');
      this.getEmployees();
      this.employeeForm.reset();
      this.closeModal();
      this.toast.success('Employee Updated Successfully', 'SUCCESS', 3000)
    })
    }
    
  }

  onEdit(Employee: Employee ){
    this.openModal();
    this.employeeForm.patchValue(Employee);
  }

  onDelete(employee: Employee)
  {
    const isConfirm = confirm('Are you sure you want to delete this employee ' + employee.name)
     
    if(isConfirm){
    this.empService.deleteEmployee(employee.id).subscribe((res)=>{
      // alert('Employee deleted Successfully');
      this.toast.success('Employee deleted Successfully', 'SUCCESS', 3000)

      this.getEmployees();
    });
  }
  

// Hello I Am Ahmad AamirSSS

  }
}