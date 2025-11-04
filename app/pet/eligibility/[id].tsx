import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePets } from '../../../hooks';
import { EligibilityService } from '../../../services/eligibility.service';
import {
  DogQuestionnaireResponse,
  CatQuestionnaireResponse,
  HorseQuestionnaireResponse,
  QuestionnaireResponse,
} from '../../../types/eligibility.types';
import { Species } from '../../../types';
import { Colors } from '../../../constants/Colors';
import { Sizes } from '../../../constants/Sizes';
import { Button, Card, Input } from '../../../components/ui';
import { FormCheckbox, FormField, FormDatePicker, FormSelect } from '../../../components/forms';

export default function EligibilityQuestionnaireScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { pets, isLoading: petsLoading } = usePets();
  const [pet, setPet] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Base questionnaire state
  const [baseAnswers, setBaseAnswers] = useState({
    goodPhysicalHealth: false,
    noChronicConditions: false,
    noRecentIllness: false,
    friendlyTemperament: false,
    comfortableWithRestraint: false,
    currentOnVaccinations: false,
    vaccinationCertificateUrl: '',
    onlyRoutineMedications: false,
    medicationsList: [] as string[],
    neverReceivedTransfusion: false,
    recentTravelHistory: '',
  });

  // Dog-specific state
  const [dogAnswers, setDogAnswers] = useState({
    spayedNeutered: false,
    notPregnantOrNursing: false,
    heartwormTestNegative: false,
    heartwormTestDate: new Date().toISOString(),
    tickBorneDiseaseNegative: false,
    dietType: 'COMMERCIAL' as 'COMMERCIAL' | 'RAW' | 'HOME_COOKED' | 'MIXED',
    activityLevel: 'MODERATE' as 'LOW' | 'MODERATE' | 'HIGH',
    exerciseRoutine: '',
    behavioralNotes: '',
  });

  // Cat-specific state
  const [catAnswers, setCatAnswers] = useState({
    spayedNeutered: false,
    indoorOnly: false,
    neverPregnant: false,
    felvFivTestNegative: false,
    felvFivTestDate: new Date().toISOString(),
    sedationTolerance: 'UNKNOWN' as 'UNKNOWN' | 'GOOD' | 'POOR',
    handlingSensitivity: 'LOW' as 'LOW' | 'MODERATE' | 'HIGH',
  });

  // Horse-specific state
  const [horseAnswers, setHorseAnswers] = useState({
    reproductiveStatus: 'GELDING' as 'STALLION' | 'GELDING' | 'MARE' | 'SPAYED_MARE',
    pregnancyHistory: '',
    cogginsTestNegative: false,
    cogginsTestDate: new Date().toISOString(),
    eiaTestNegative: false,
    performanceMedications: [] as string[],
    stableLocation: '',
    transportAvailable: false,
    previousSedationHistory: '',
  });

  useEffect(() => {
    if (!petsLoading && pets.length > 0) {
      const foundPet = pets.find((p) => p.petId === id);
      if (foundPet) {
        setPet(foundPet);
      } else {
        Alert.alert('Error', 'Pet not found');
        router.back();
      }
    }
  }, [petsLoading, pets, id]);

  const totalSteps = pet?.species === Species.DOG ? 3 : pet?.species === Species.CAT ? 3 : pet?.species === Species.HORSE ? 3 : 2;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      let questionnaireResponse: QuestionnaireResponse;

      if (pet.species === Species.DOG) {
        questionnaireResponse = {
          ...baseAnswers,
          ...dogAnswers,
          species: Species.DOG,
        } as DogQuestionnaireResponse;
      } else if (pet.species === Species.CAT) {
        questionnaireResponse = {
          ...baseAnswers,
          ...catAnswers,
          species: Species.CAT,
        } as CatQuestionnaireResponse;
      } else if (pet.species === Species.HORSE) {
        questionnaireResponse = {
          ...baseAnswers,
          ...horseAnswers,
          species: Species.HORSE,
        } as HorseQuestionnaireResponse;
      } else {
        throw new Error('Invalid species');
      }

      const eligibilityRecord = await EligibilityService.submitQuestionnaire(
        pet.petId,
        questionnaireResponse
      );

      // Navigate to results screen
      router.replace({
        pathname: '/pet/eligibility/results/[recordId]',
        params: { recordId: eligibilityRecord.eligibilityId },
      });
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      Alert.alert('Error', 'Failed to submit questionnaire. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (petsLoading || !pet) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressStep,
              index + 1 <= currentStep && styles.progressStepActive,
            ]}
          />
        ))}
      </View>
      <Text style={styles.progressText}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );

  const renderBaseQuestions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>General Health</Text>
      
      <FormCheckbox
        label="My pet is in good physical health"
        value={baseAnswers.goodPhysicalHealth}
        onChange={(value) =>
          setBaseAnswers({ ...baseAnswers, goodPhysicalHealth: value })
        }
      />

      <FormCheckbox
        label="My pet has no chronic medical conditions"
        value={baseAnswers.noChronicConditions}
        onChange={(value) =>
          setBaseAnswers({ ...baseAnswers, noChronicConditions: value })
        }
      />

      <FormCheckbox
        label="My pet has not been ill in the past 30 days"
        value={baseAnswers.noRecentIllness}
        onChange={(value) =>
          setBaseAnswers({ ...baseAnswers, noRecentIllness: value })
        }
      />

      <Text style={styles.sectionTitle}>Temperament</Text>

      <FormCheckbox
        label="My pet has a friendly, calm temperament"
        value={baseAnswers.friendlyTemperament}
        onChange={(value) =>
          setBaseAnswers({ ...baseAnswers, friendlyTemperament: value })
        }
      />

      <FormCheckbox
        label="My pet is comfortable with restraint and handling"
        value={baseAnswers.comfortableWithRestraint}
        onChange={(value) =>
          setBaseAnswers({ ...baseAnswers, comfortableWithRestraint: value })
        }
      />

      <Text style={styles.sectionTitle}>Vaccinations & Medical History</Text>

      <FormCheckbox
        label="My pet is current on all vaccinations"
        value={baseAnswers.currentOnVaccinations}
        onChange={(value) =>
          setBaseAnswers({ ...baseAnswers, currentOnVaccinations: value })
        }
      />

      <FormCheckbox
        label="My pet is only on routine medications (if any)"
        value={baseAnswers.onlyRoutineMedications}
        onChange={(value) =>
          setBaseAnswers({ ...baseAnswers, onlyRoutineMedications: value })
        }
      />

      <FormCheckbox
        label="My pet has never received a blood transfusion"
        value={baseAnswers.neverReceivedTransfusion}
        onChange={(value) =>
          setBaseAnswers({ ...baseAnswers, neverReceivedTransfusion: value })
        }
      />

      <FormField label="Recent Travel History (if any)">
        <Input
          placeholder="Enter any recent travel outside your area"
          value={baseAnswers.recentTravelHistory}
          onChangeText={(value) =>
            setBaseAnswers({ ...baseAnswers, recentTravelHistory: value })
          }
          multiline
          numberOfLines={3}
        />
      </FormField>
    </View>
  );

  const renderDogQuestions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Dog-Specific Questions</Text>

      <FormCheckbox
        label="My dog is spayed or neutered (recommended)"
        value={dogAnswers.spayedNeutered}
        onChange={(value) =>
          setDogAnswers({ ...dogAnswers, spayedNeutered: value })
        }
      />

      <FormCheckbox
        label="My dog is not pregnant or nursing"
        value={dogAnswers.notPregnantOrNursing}
        onChange={(value) =>
          setDogAnswers({ ...dogAnswers, notPregnantOrNursing: value })
        }
      />

      <FormCheckbox
        label="My dog tested negative for heartworm"
        value={dogAnswers.heartwormTestNegative}
        onChange={(value) =>
          setDogAnswers({ ...dogAnswers, heartwormTestNegative: value })
        }
      />

      <FormDatePicker
        label="Heartworm Test Date"
        value={new Date(dogAnswers.heartwormTestDate)}
        onChange={(date) =>
          setDogAnswers({ ...dogAnswers, heartwormTestDate: date.toISOString() })
        }
        maximumDate={new Date()}
      />

      <FormCheckbox
        label="My dog tested negative for tick-borne diseases"
        value={dogAnswers.tickBorneDiseaseNegative}
        onChange={(value) =>
          setDogAnswers({ ...dogAnswers, tickBorneDiseaseNegative: value })
        }
      />

      <FormSelect
        label="Diet Type"
        value={dogAnswers.dietType}
        onSelect={(value) =>
          setDogAnswers({ ...dogAnswers, dietType: value as any })
        }
        options={[
          { label: 'Commercial Dog Food', value: 'COMMERCIAL' },
          { label: 'Raw Food Diet', value: 'RAW' },
          { label: 'Home Cooked', value: 'HOME_COOKED' },
          { label: 'Mixed Diet', value: 'MIXED' },
        ]}
      />

      <FormSelect
        label="Activity Level"
        value={dogAnswers.activityLevel}
        onSelect={(value) =>
          setDogAnswers({ ...dogAnswers, activityLevel: value as any })
        }
        options={[
          { label: 'Low', value: 'LOW' },
          { label: 'Moderate', value: 'MODERATE' },
          { label: 'High', value: 'HIGH' },
        ]}
      />

      <FormField label="Exercise Routine">
        <Input
          placeholder="Describe your dog's typical exercise routine"
          value={dogAnswers.exerciseRoutine}
          onChangeText={(value) =>
            setDogAnswers({ ...dogAnswers, exerciseRoutine: value })
          }
          multiline
          numberOfLines={3}
        />
      </FormField>

      <FormField label="Behavioral Notes (optional)">
        <Input
          placeholder="Any behavioral information we should know"
          value={dogAnswers.behavioralNotes}
          onChangeText={(value) =>
            setDogAnswers({ ...dogAnswers, behavioralNotes: value })
          }
          multiline
          numberOfLines={3}
        />
      </FormField>
    </View>
  );

  const renderCatQuestions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Cat-Specific Questions</Text>

      <FormCheckbox
        label="My cat is spayed or neutered (required)"
        value={catAnswers.spayedNeutered}
        onChange={(value) =>
          setCatAnswers({ ...catAnswers, spayedNeutered: value })
        }
      />

      <FormCheckbox
        label="My cat is indoor-only (required)"
        value={catAnswers.indoorOnly}
        onChange={(value) =>
          setCatAnswers({ ...catAnswers, indoorOnly: value })
        }
      />

      <FormCheckbox
        label="My cat has never been pregnant"
        value={catAnswers.neverPregnant}
        onChange={(value) =>
          setCatAnswers({ ...catAnswers, neverPregnant: value })
        }
      />

      <FormCheckbox
        label="My cat tested negative for FeLV/FIV"
        value={catAnswers.felvFivTestNegative}
        onChange={(value) =>
          setCatAnswers({ ...catAnswers, felvFivTestNegative: value })
        }
      />

      <FormDatePicker
        label="FeLV/FIV Test Date"
        value={new Date(catAnswers.felvFivTestDate)}
        onChange={(date) =>
          setCatAnswers({ ...catAnswers, felvFivTestDate: date.toISOString() })
        }
        maximumDate={new Date()}
      />

      <FormSelect
        label="Sedation Tolerance"
        value={catAnswers.sedationTolerance}
        onSelect={(value) =>
          setCatAnswers({ ...catAnswers, sedationTolerance: value as any })
        }
        options={[
          { label: 'Unknown', value: 'UNKNOWN' },
          { label: 'Good', value: 'GOOD' },
          { label: 'Poor', value: 'POOR' },
        ]}
      />

      <FormSelect
        label="Handling Sensitivity"
        value={catAnswers.handlingSensitivity}
        onSelect={(value) =>
          setCatAnswers({ ...catAnswers, handlingSensitivity: value as any })
        }
        options={[
          { label: 'Low - Very tolerant', value: 'LOW' },
          { label: 'Moderate - Generally tolerant', value: 'MODERATE' },
          { label: 'High - Sensitive to handling', value: 'HIGH' },
        ]}
      />
    </View>
  );

  const renderHorseQuestions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Horse-Specific Questions</Text>

      <FormSelect
        label="Reproductive Status"
        value={horseAnswers.reproductiveStatus}
        onSelect={(value) =>
          setHorseAnswers({ ...horseAnswers, reproductiveStatus: value as any })
        }
        options={[
          { label: 'Stallion', value: 'STALLION' },
          { label: 'Gelding', value: 'GELDING' },
          { label: 'Mare', value: 'MARE' },
          { label: 'Spayed Mare', value: 'SPAYED_MARE' },
        ]}
      />

      <FormField label="Pregnancy History (if applicable)">
        <Input
          placeholder="Enter pregnancy history for mares"
          value={horseAnswers.pregnancyHistory}
          onChangeText={(value) =>
            setHorseAnswers({ ...horseAnswers, pregnancyHistory: value })
          }
          multiline
          numberOfLines={3}
        />
      </FormField>

      <FormCheckbox
        label="My horse tested negative for Coggins/EIA"
        value={horseAnswers.cogginsTestNegative}
        onChange={(value) =>
          setHorseAnswers({ ...horseAnswers, cogginsTestNegative: value })
        }
      />

      <FormDatePicker
        label="Coggins Test Date"
        value={new Date(horseAnswers.cogginsTestDate)}
        onChange={(date) =>
          setHorseAnswers({ ...horseAnswers, cogginsTestDate: date.toISOString() })
        }
        maximumDate={new Date()}
      />

      <FormCheckbox
        label="My horse tested negative for EIA"
        value={horseAnswers.eiaTestNegative}
        onChange={(value) =>
          setHorseAnswers({ ...horseAnswers, eiaTestNegative: value })
        }
      />

      <FormField label="Stable Location">
        <Input
          placeholder="Enter stable or farm location"
          value={horseAnswers.stableLocation}
          onChangeText={(value) =>
            setHorseAnswers({ ...horseAnswers, stableLocation: value })
          }
        />
      </FormField>

      <FormCheckbox
        label="Transport to donation facility is available"
        value={horseAnswers.transportAvailable}
        onChange={(value) =>
          setHorseAnswers({ ...horseAnswers, transportAvailable: value })
        }
      />

      <FormField label="Previous Sedation History (optional)">
        <Input
          placeholder="Describe any previous sedation experiences"
          value={horseAnswers.previousSedationHistory}
          onChangeText={(value) =>
            setHorseAnswers({ ...horseAnswers, previousSedationHistory: value })
          }
          multiline
          numberOfLines={3}
        />
      </FormField>
    </View>
  );

  const renderCurrentStep = () => {
    if (currentStep === 1) {
      return renderBaseQuestions();
    }

    if (currentStep === 2) {
      if (pet.species === Species.DOG) return renderDogQuestions();
      if (pet.species === Species.CAT) return renderCatQuestions();
      if (pet.species === Species.HORSE) return renderHorseQuestions();
    }

    // Review step
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Review Your Answers</Text>
        <Card>
          <Text style={styles.reviewText}>
            Please review your answers before submitting. You can go back to make changes if needed.
          </Text>
          <Text style={styles.reviewText}>
            Once submitted, our team will evaluate {pet.name}'s eligibility and you'll receive the results immediately.
          </Text>
        </Card>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Eligibility Questionnaire</Text>
          <Text style={styles.subtitle}>for {pet.name}</Text>
        </View>

        {renderProgressBar()}
        {renderCurrentStep()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <Button
            title="Back"
            onPress={handleBack}
            variant="outline"
            style={styles.footerButton}
          />
        )}
        {currentStep < totalSteps ? (
          <Button
            title="Next"
            onPress={handleNext}
            style={styles.footerButton}
          />
        ) : (
          <Button
            title={submitting ? 'Submitting...' : 'Submit'}
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting}
            style={styles.footerButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Sizes.spacing.md,
    paddingBottom: 100,
  },
  header: {
    marginBottom: Sizes.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  progressContainer: {
    marginBottom: Sizes.spacing.lg,
  },
  progressBar: {
    flexDirection: 'row',
    gap: Sizes.spacing.sm,
    marginBottom: Sizes.spacing.md,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Sizes.borderRadius.sm,
  },
  progressStepActive: {
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    gap: Sizes.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Sizes.spacing.md,
    marginBottom: Sizes.spacing.sm,
  },
  reviewText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: Sizes.spacing.md,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: Sizes.spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Sizes.spacing.md,
  },
  footerButton: {
    flex: 1,
  },
});
