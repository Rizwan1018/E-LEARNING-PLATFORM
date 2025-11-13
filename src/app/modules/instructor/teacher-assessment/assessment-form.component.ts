import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../../services/assessment.service';
import { Assessment } from '../../../models/assessment';

@Component({
  selector: 'app-assessment-form',
  standalone: false,
  templateUrl: './assessment-form.component.html',
})
export class AssessmentFormComponent implements OnInit {
  form!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private service: AssessmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      questions: this.fb.array([]),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getAssessment(id).subscribe(a => this.setForm(a));
    } else {
      this.addQuestion(); // Start with one default question
    }
  }

  get questions(): FormArray<FormGroup> {
    return this.form.get('questions') as FormArray<FormGroup>;
  }
  getOptions(i: number): FormArray {
    return this.questions.at(i).get('options') as FormArray;
  }

  get editing(): boolean {
    return !!this.form.get('id')?.value;
  }

  ctrl(path: string | (string | number)[]): AbstractControl | null {
    return this.form.get(path as any);
  }

  showInvalid(control: AbstractControl | null): boolean {
    return !!control && control.invalid && (control.touched || control.dirty || this.submitted);
  }

  qGroup(q?: { text?: string, options?: string[], correctAnswer?: number }) {
    const opts = q?.options?.length ? q.options : Array(4).fill('');
    const grp = this.fb.group({
      text: [q?.text || '', [Validators.required, Validators.minLength(3)]],
      options: this.fb.array(opts.map(opt => this.fb.control(opt, Validators.required))),
      correctAnswer: [q?.correctAnswer ?? 0, Validators.required],
    }, { validators: correctAnswerInRangeValidator });
    grp.get('options')?.valueChanges.subscribe(() =>
      grp.get('correctAnswer')?.updateValueAndValidity()
    );
    return grp;
  }

  addQuestion() {
    this.questions.push(this.qGroup());
  }
  removeQuestion(i: number) {
    this.questions.removeAt(i);
  }

  setForm(a: Assessment) {
    this.questions.clear();
    (a.questions || []).forEach(q => this.questions.push(this.qGroup(q)));
    this.form.patchValue({
      id: a.id ?? null,
      title: a.title ?? '',
      description: a.description ?? '',
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.toAssessmentPayload();
    const obs = payload.id ? this.service.updateAssessment(payload) : this.service.addAssessment(payload);

    obs.subscribe(() => {
      this.submitted = false;
      this.router.navigate(['instructor/add-assessment']);
    });
  }

  private toAssessmentPayload(): Assessment {
    const raw = this.form.getRawValue();
    
    const questions = (raw.questions || []).map((q: any) => ({
      text: (q.text || '').trim(),
      options: (q.options || []).map((o: any) => String(o ?? '').trim()),
      correctAnswer: Number(q.correctAnswer),
    }));
    return {
      id: raw.id ?? undefined,
      title: (raw.title || '').trim(),
      description: (raw.description || '').trim(),
      questions,
    } as Assessment;
  }

}

function correctAnswerInRangeValidator(group: AbstractControl): ValidationErrors | null {
  const options = (group.get('options') as FormArray)?.length;
  const cA = Number(group.get('correctAnswer')?.value);
  if (isNaN(cA)) return { answerNotNumber: true };
  if (cA < 0 || cA >= options) return { answerOutOfRange: true };
  return null;
}